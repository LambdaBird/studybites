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
};

async function handler({ params: { id: uuid }, body: { password } }) {
  const {
    models: { User },
    emailModel: Email,
    redisModel: Redis,
    config: {
      emailService: { emailServiceErrors: errors },
    },
    createAccessToken,
    createRefreshToken,
  } = this;

  const email = await Redis.getEmailByUuid({ uuid });
  if (!email) {
    throw new BadRequestError(errors.EMAIL_ERR_VERIFY);
  }
  const { id: userId, language } = await User.getUserByEmail({ email });

  const hash = await hashPassword(password);

  await User.updatePassword({
    password: hash,
    userId,
  });

  const accessToken = createAccessToken(this, userId, email);
  const refreshToken = createRefreshToken(this, userId);

  await Redis.invalidateLink({ email, uuid });
  await Email.sendPasswordChanged({ email, language });

  return { accessToken, refreshToken };
}

export default { options, handler };
