const options = {
  schema: {
    querystring: { $ref: 'courseSearch#' },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          courses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                description: { type: ['string', 'null'] },
                status: { type: 'string' },
                author: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                  },
                },
                isStarted: { type: 'boolean' },
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
  query: { search, offset, limit, progress, tags },
}) {
  const {
    models: { Course },
  } = this;

  if (progress === 'finished') {
    const { total, results: courses } = await Course.getAllFinishedCourses({
      userId,
      offset,
      limit,
      search,
      tags,
    });

    return { total, courses };
  }

  const { total, results: courses } = await Course.getOngoingCourses({
    userId,
    offset,
    limit,
    search,
    tags,
  });

  return { total, courses };
}

export default { options, handler };
