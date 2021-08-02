export const learnLessonOptions = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        action: { type: 'string' },
        blockId: { type: 'string' },
        revision: { type: 'string' },
        data: {
          type: 'object',
          additionalProperties: false,
          properties: {
            question: { type: 'string' },
            answers: { type: 'array' },
            response: { type: 'array' },
            isSolved: { type: 'boolean' },
          },
          oneOf: [
            {
              required: ['answers'],
            },
            {
              required: ['response'],
            },
            {
              required: ['isSolved'],
            },
          ],
        },
      },
      if: {
        properties: {
          action: { enum: ['start', 'finish'] },
        },
      },
      then: {
        properties: {
          blockId: { type: 'null', const: null },
          revision: { type: 'null', const: null },
          data: { type: 'null', const: null },
        },
        required: ['action'],
      },
      else: {
        required: ['action', 'blockId', 'revision', 'data'],
      },
    },
    response: {
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
      status: resources.LESSON.learnStatus,
    });
  },
};
