export const getLearnOptions = {
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
              authors: { type: 'array' },
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
    await this.access({
      userId,
      resourceId,
      resourceType: this.config.resources.LESSON,
      roleId: this.config.roles.STUDENT.id,
    });
  },
};
