const options = {
  schema: {
    querystring: { $ref: 'userSearch#' },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req, isAdminOnly: true });
  },
};

async function handler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { User },
  } = this;

  const { total, results: data } = await User.getAllUsers({
    userId,
    offset,
    limit,
    search,
  });

  return { total, data };
}

export default { options, handler };
