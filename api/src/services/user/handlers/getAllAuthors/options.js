export const getAllAuthorsOptions = {
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
