export const updateUserLanguageOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        language: { type: 'string' },
      },
    },

    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ body: { email } }) {
    this.validateEmail({ email });
  },
};
