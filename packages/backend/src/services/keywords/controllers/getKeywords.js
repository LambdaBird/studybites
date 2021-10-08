const options = {
  schema: {
    querystring: { $ref: 'keywordSearch#' },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
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
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler({ query: { search, offset, limit } }) {
  const {
    models: { Keyword },
  } = this;

  const { total, results: keywords } = await Keyword.getAll({
    search,
    offset,
    limit,
  });

  return { total, keywords };
}

export default { options, handler };
