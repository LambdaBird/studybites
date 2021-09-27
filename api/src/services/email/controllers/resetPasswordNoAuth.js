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
    config: {
      emailService: {
        emailServiceErrors: errors,
        emailServiceMessages: messages,
      },
    },
    emailUtils,
  } = this;
  const host = headers['x-forwarded-host'];
  const userIp = socket.remoteAddress || headers['x-forwarded-for'];
  const { allowed, timeout } = await emailUtils.getResetPasswordAllowedNoAuth({
    userIp,
  });
  if (!allowed) {
    throw new BadRequestWithPayloadError(errors.EMAIL_ERR_TOO_FREQUENTLY, {
      timeout,
    });
  }
  await emailUtils.setUserIp({ userIp });
  try {
    await User.getUserByEmail({ email });
  } catch (e) {
    // Do nothing if user not found with this email
    return { message: messages.EMAIL_MESSAGE_SENT_SUCCESSFULLY };
  }

  const link = await emailUtils.generateLink({ host, email });
  await emailUtils.sendResetPassword({ email, link });
  return { message: messages.EMAIL_MESSAGE_SENT_SUCCESSFULLY };
}

export default { options, handler };
