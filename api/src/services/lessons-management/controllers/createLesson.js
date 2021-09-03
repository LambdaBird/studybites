const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        lesson: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: ['string', 'null'] },
            image: { type: ['string', 'null'] },
            status: { $ref: 'lessonStatus#' },
          },
          required: ['name'],
        },
        blocks: { type: 'array', default: [] },
      },
      required: ['lesson'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          lesson: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: ['string', 'null'] },
              image: { type: ['string', 'null'] },
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
              blocks: { type: ['array', 'null'] },
            },
          },
        },
      },
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId } }) {
    await this.access({
      userId,
      roleId: this.config.globals.roles.TEACHER.id,
    });
  },
};

async function handler({ body: { lesson, blocks }, user: { id: userId } }) {
  const {
    models: { Lesson, UserRole, Block, LessonBlockStructure },
  } = this;

  try {
    const data = await Lesson.transaction(async (trx) => {
      const lessonData = await Lesson.createLesson({ trx, lesson });
      await UserRole.addMaintainer({ trx, userId, resourceId: lessonData.id });

      if (blocks.length) {
        blocks.forEach((block) => {
          if (!block.weight) {
            // eslint-disable-next-line no-param-reassign
            block.weight = 1.0;
          }
        });
        const blocksData = await Block.createBlocks({ trx, blocks });
        await LessonBlockStructure.insertBlocks({
          trx,
          blocks: blocksData,
          lessonId: lessonData.id,
        });
      }

      return lessonData;
    });

    data.blocks = await LessonBlockStructure.getAllBlocks({
      lessonId: data.id,
    });

    return { lesson: data };
  } catch (err) {
    throw new Error(err);
  }
}

export default { options, handler };
