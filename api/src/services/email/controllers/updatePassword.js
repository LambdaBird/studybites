import { hashPassword } from '../../../../utils/salt';
import { BadRequestError } from '../../../validation/errors';

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
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler({ params: { id: uuid }, body: { password } }) {
  const {
    models: { User },
    emailUtils: { getEmailByUuid, invalidateLink, sendPasswordChanged },
    config: {
      emailService: { emailServiceErrors: errors },
    },
    createAccessToken,
    createRefreshToken,
  } = this;

  const email = await getEmailByUuid({ uuid });
  if (!email) {
    throw new BadRequestError(errors.EMAIL_ERR_VERIFY);
  }
  const { id: userId } = await User.getUserByEmail({ email });

  const hash = await hashPassword(password);

  await User.updatePassword({
    password: hash,
    userId,
  });

  const accessToken = createAccessToken(this, userId);
  const refreshToken = createRefreshToken(this, userId);

  await invalidateLink({ email, uuid });
  await sendPasswordChanged({ email });

  return { accessToken, refreshToken };
}

export default { options, handler };
