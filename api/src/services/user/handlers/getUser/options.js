export const getUserOptions = {
  schema: {
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
      required: ['userId'],
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req, isAdminOnly: true });
  },
};
