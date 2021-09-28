import { hashPassword } from '../../../../utils/salt';
import { BadRequestError } from '../../../validation/errors';
import { createAccessToken, createRefreshToken } from '../../user/utils';

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

export const authWithNewPassword = async ({
  instance,
  User,
  userId,
  uuid,
  email,
  password,
}) => {
  const {
    emailUtils: { verifyPasswordReset, invalidateLink, sendPasswordChanged },
    config: {
      emailService: { emailServiceErrors: errors },
    },
  } = instance;
  const verified = await verifyPasswordReset({ email, uuid });
  if (!verified) {
    throw new BadRequestError(errors.EMAIL_ERR_VERIFY);
  }

  const hash = await hashPassword(password);

  await User.updatePassword({
    password: hash,
    userId,
  });

  const accessToken = createAccessToken(instance, userId);
  const refreshToken = createRefreshToken(instance, userId);

  await invalidateLink({ email, uuid });
  await sendPasswordChanged({ email });

  return { accessToken, refreshToken };
};

async function handler({
  user: { id: userId },
  params: { id: uuid },
  body: { password },
}) {
  const {
    models: { User },
  } = this;

  const { email } = await User.getUser({ userId });

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
