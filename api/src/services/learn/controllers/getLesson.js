const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          lesson: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: ['string', 'null'] },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              author: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
              interactiveTotal: { type: 'number' },
              interactivePassed: { type: 'number' },
              blocks: { type: 'array' },
            },
          },
          isFinal: { type: 'boolean' },
          isFinished: { type: 'boolean' },
        },
        required: ['total', 'lesson'],
      },
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    const { resources, roles } = this.config.globals;

    await this.access({
      userId,
      resourceId,
      resourceType: resources.LESSON.name,
      roleId: roles.STUDENT.id,
    });
  },
};

const mapResultToBlock = ({ blocks, dictionary }) => {
  return blocks.map((block) => {
    if (dictionary[block.blockId]) {
      if (dictionary[block.blockId].revision === block.revision) {
        return {
          ...block,
          ...dictionary[block.blockId],
          isSolved: true,
        };
      }
    }
    return block;
  });
};

async function handler({ user: { id: userId }, params: { lessonId } }) {
  const {
    models: { Lesson, Result, LessonBlockStructure },
  } = this;
  /**
   * get lesson
   */
  const lesson = await Lesson.getLessonWithProgress({ lessonId, userId });
  /**
   * get last record from the results table
   */
  const lastResult = await Result.getLastResult({ userId, lessonId });

  const { count: total } = await LessonBlockStructure.countBlocks({
    lessonId,
  });
  /**
   * if the lesson was not started yet
   */
  if (!lastResult) {
    lesson.blocks = [];
    return { total, lesson, isFinal: false };
  }
  /**
   * get results for interactive blocks
   */
  const dictionary = await Result.interactiveBlocksResults({
    lessonId,
    userId,
  });
  /**
   * if the lesson was finished
   */
  if (lastResult.action === 'finish') {
    const blocks = await LessonBlockStructure.getAllBlocks({ lessonId });
    lesson.blocks = mapResultToBlock({ blocks, dictionary });

    return {
      total,
      lesson,
      isFinished: true,
    };
  }
  /**
   * else
   */
  const { chunk, isFinal } = await LessonBlockStructure.getChunk({
    lessonId,
    previousBlock: lastResult.blockId,
    fromStart: true,
    shouldStrip: false,
  });
  lesson.blocks = mapResultToBlock({ blocks: chunk, dictionary });

  const lastBlock = lesson.blocks[lesson.blocks.length - 1];
  if (lastBlock && !lastBlock.isSolved) {
    delete lastBlock.answer;
    delete lastBlock.weight;
  }

  return { total, lesson, isFinal };
}

export default { options, handler };
