export const signUpOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string', pattern: '^(?=.*\\d)(?=.*\\D).{5,}$' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
      required: ['email', 'password', 'firstName', 'lastName'],
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async preHandler({ body: { email } }) {
    this.validateEmail({ email });
  },
};
