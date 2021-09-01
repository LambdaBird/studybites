const options = {
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

async function handler({
  user: { id: userId },
  query: { search, offset, limit, authors },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllPublicLessons({
    userId,
    offset,
    limit,
    search,
    authors,
  });

  return { total, lessons };
}

export default { options, handler };
