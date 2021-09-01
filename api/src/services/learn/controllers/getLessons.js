const options = {
  schema: {
    querystring: { $ref: 'lessonSearch#' },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          lessons: {
            type: 'array',
            items: {
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
                isStarted: { type: 'boolean' },
              },
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
};

async function handler({
  user: { id: userId },
  query: { search, offset, limit, progress, authors },
}) {
  const {
    models: { Lesson, Result },
  } = this;

  if (progress === 'finished') {
    const { total, results: lessons } = await Lesson.getAllFinishedLessons({
      userId,
      offset,
      limit,
      search,
      authors,
    });

    return { total, lessons };
  }

  const { excludeLessons } = await Result.getFinishedLessons({ userId });

  const { total, results: lessons } = await Lesson.getOngoingLessons({
    userId,
    excludeLessons,
    offset,
    limit,
    search,
    authors,
  });

  return { total, lessons };
}

export default { options, handler };
