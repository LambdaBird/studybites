import { BadRequestWithPayloadError } from '../../../validation/errors/BadRequestWithPayloadError';

const options = {
  schema: {
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler({ user: { id: userId } }) {
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
  const { email, language } = await User.getUser({ userId });

  const { allowed, timeout } = await Redis.getResetPasswordAllowed({
    email,
  });

  if (!allowed) {
    throw new BadRequestWithPayloadError(errors.EMAIL_ERR_TOO_FREQUENTLY, {
      timeout,
    });
  }

  const link = await Redis.generateLink({ host, email });
  await Email.sendResetPassword({ email, link, language });
  return {
    message: messages.EMAIL_MESSAGE_LINK_SENT,
  };
}

export default { options, handler };
