export const enrolledLessonsOptions = {
  schema: {
    querystring: { $ref: 'lessonSearch#' },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          lessons: { type: 'array' },
        },
      },
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
};
