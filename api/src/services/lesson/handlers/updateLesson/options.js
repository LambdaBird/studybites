export const updateLessonOptions = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
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
        },
        blocks: { type: 'array' },
      },
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
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    const { resources, roles } = this.config.globals;

    await this.access({
      userId,
      resourceId,
      resourceType: resources.LESSON.name,
      roleId: roles.MAINTAINER.id,
    });
  },
};
