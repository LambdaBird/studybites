export const createLessonOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
            },
          },
        },
        lesson: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: ['string', 'null'] },
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
