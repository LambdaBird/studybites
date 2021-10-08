const options = {
  schema: {
    querystring: { $ref: 'userSearch#' },
    response: {
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
    models: { UserRole },
  } = this;

  const { total, results: authors } = await UserRole.getAllAuthors({
    offset,
    limit,
    search,
  });

  return { total, authors };
}

export default { options, handler };
