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
      globals: { host },
    },
    emailModel: Email,
    redisModel: Redis,
  } = this;
  const userIp = socket.remoteAddress || headers['x-forwarded-for'];
  const { allowed, timeout } = await Redis.getResetPasswordAllowedNoAuth({
    userIp,
  });
  if (!allowed) {
    throw new BadRequestWithPayloadError(errors.EMAIL_ERR_TOO_FREQUENTLY, {
      timeout,
    });
  }
  await Redis.setUserIp({ userIp });

  try {
    const { language } = await User.getUserByEmail({ email });
    const link = await Redis.generateLink({ host, email });
    await Email.sendResetPassword({ email, link, language });
  } catch (e) {
    // Do nothing if user not found with this email
  }

  return { message: messages.EMAIL_MESSAGE_LINK_SENT };
}

export default { options, handler };
