import { authWithNewPassword } from './updatePassword';

const options = {
  schema: {
    params: { $ref: 'passwordResetId#' },
    body: {
      type: 'object',
      properties: {
        password: { type: 'string' },
      },
      required: ['password'],
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
};

async function handler({ params: { id: uuid }, body: { password } }) {
  const {
    models: { User },
    emailUtils,
  } = this;

  const email = await emailUtils.getEmailByUuid({ uuid });
  const { id: userId } = await User.getUserByEmail({ email });

  const { accessToken, refreshToken } = await authWithNewPassword({
    instance: this,
    User,
    userId,
    uuid,
    email,
    password,
  });
  return { accessToken, refreshToken };
}

export default { options, handler };
