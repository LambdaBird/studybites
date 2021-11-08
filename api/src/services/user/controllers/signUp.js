import { hashPassword } from '../../../../utils/salt';

const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { $ref: 'passwordPattern#' },
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

async function handler({ body }) {
  const {
    models: { User },
    createAccessToken,
    createRefreshToken,
  } = this;
  const hash = await hashPassword(body.password);

  const { id } = await User.createOne({
    userData: { ...body, email: body.email.toLowerCase(), password: hash },
  });

  const accessToken = createAccessToken(this, id);
  const refreshToken = createRefreshToken(this, id);

  return {
    accessToken,
    refreshToken,
  };
}

export default { options, handler };
