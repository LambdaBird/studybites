export const updateUserOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { $ref: 'passwordPattern#' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        settings: {
          type: 'object',
          properties: {
            language: { type: 'string' },
          },
        },
        isConfirmed: { type: 'boolean' },
        isSuperAdmin: { type: 'boolean' },
      },
    },
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
  async preHandler({ body: { email } }) {
    this.validateEmail({ email });
  },
};
