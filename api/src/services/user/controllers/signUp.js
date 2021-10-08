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

async function handler({ body, headers }) {
  const {
    models: { User },
    createAccessToken,
    createRefreshToken,
    emailModel: Email,
    redisModel: Redis,
  } = this;
  const host = headers['x-forwarded-host'];
  const hash = await hashPassword(body.password);

  const { id, email } = await User.createOne({
    userData: { ...body, password: hash },
  });

  const accessToken = createAccessToken(this, id);
  const refreshToken = createRefreshToken(this, id);

  const link = await Redis.generateConfirmationLink({ host, email });
  await Email.sendEmailConfirmation({ email, link });

  return {
    accessToken,
    refreshToken,
  };
}

export default { options, handler };
