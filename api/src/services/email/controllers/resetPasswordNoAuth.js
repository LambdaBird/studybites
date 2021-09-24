import { emailUtils } from '../../../../utils/email';
import { emailServiceErrors } from '../../../config';
import { BadRequestWithPayloadError } from '../../../validation/errors/BadRequestWithPayloadError';

const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
      required: ['email'],
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
};

async function handler({ body: { email }, socket, headers }) {
  const {
    models: { User },
  } = this;
  const host = headers['x-forwarded-host'];
  const userIp = socket.remoteAddress || headers['x-forwarded-for'];
  const { allowed, timeout } = await emailUtils.getResetPasswordAllowedNoAuth({
    userIp,
  });
  if (!allowed) {
    throw new BadRequestWithPayloadError(
      emailServiceErrors.EMAIL_ERR_TOO_FREQUENTLY,
      { timeout },
    );
  }
  const message = 'Email sent successfully';
  await emailUtils.setUserIp({ userIp });
  try {
    await User.getUserByEmail({ email });
  } catch (e) {
    // Do nothing if user not found with this email
    return { message };
  }

  const link = await emailUtils.generateLink({ host, email });
  await emailUtils.sendResetPassword({ email, link });
  return { message };
}

export default { options, handler };
