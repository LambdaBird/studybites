import config from '../../../../config';

import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';

export const options = {
  schema: {
    params: {
      type: 'object',
      properties: {
        lessonId: { type: 'number' },
      },
      required: ['lessonId'],
    },
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
              maintainers: { type: 'array' },
              blocks: { type: 'array' },
            },
          },
          isFinal: { type: 'boolean' },
          isFinished: { type: 'boolean' },
        },
        required: ['total', 'lesson'],
      },
      ...errorResponse,
    },
  },
  errorHandler,
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    await this.access({
      userId,
      resourceId,
      resourceType: config.resources.LESSON,
      roleId: config.roles.STUDENT.id,
    });
  },
};

export async function handler({ user: { id: userId }, params: { lessonId } }) {
  const {
    knex,
    models: { Lesson, Result, LessonBlockStructure },
  } = this;
  /**
   * get lesson
   */
  const lesson = await Lesson.query()
    .first()
    .where({ id: lessonId })
    .withGraphFetched('maintainers');
  /**
   * get last record from the results table
   */
  const lastResult = await Result.getLastResult({ userId, lessonId });
  /**
   * if the lesson was not started yet
   */
  if (!lastResult) {
    lesson.blocks = [];
    return { total: 0, lesson, isFinal: false };
  }
  /**
   * get results for interactive blocks
   */
  const results = await Result.query()
    .select('results.data', 'results.blockId', 'results.revision')
    .from(
      knex.raw(`
          (select block_id, max(created_at) as created_at from results 
          where lesson_id = ${lessonId} and user_id = ${userId} and data is not null group by block_id) as temp
        `),
    )
    .join(
      knex.raw(
        `results on results.block_id = temp.block_id and results.created_at = temp.created_at`,
      ),
    );

  const dictionary = results.reduce((result, filter) => {
    // eslint-disable-next-line no-param-reassign
    result[filter.blockId] = filter;
    return result;
  }, {});
  /**
   * if the lesson was finished
   */
  if (lastResult.action === 'finish') {
    const blocks = await LessonBlockStructure.getAllBlocks({ lessonId });

    lesson.blocks = blocks.map((block) => {
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

    return {
      total: blocks.length,
      lesson,
      isFinished: true,
    };
  }
  /**
   * else
   */
  const { total, chunk, isFinal } = await LessonBlockStructure.getChunk({
    lessonId,
    previousBlock: lastResult.blockId,
    fromStart: true,
    shouldStrip: false,
  });

  lesson.blocks = chunk.map((block) => {
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

  if (!lesson.blocks[lesson.blocks.length - 1].isSolved) {
    delete lesson.blocks[lesson.blocks.length - 1].answer;
    delete lesson.blocks[lesson.blocks.length - 1].weight;
  }

  return { total, lesson, isFinal };
}
