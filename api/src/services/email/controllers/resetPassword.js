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

async function handler({ user: { id: userId }, headers }) {
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
  const { email } = await User.getUser({ userId });

  const { allowed, timeout } = await emailUtils.getResetPasswordAllowed({
    email,
  });

  if (!allowed) {
    throw new BadRequestWithPayloadError(errors.EMAIL_ERR_TOO_FREQUENTLY, {
      timeout,
    });
  }

  const link = await emailUtils.generateLink({ host, email });
  await emailUtils.sendResetPassword({ email, link });
  return {
    message: messages.EMAIL_MESSAGE_LINK_SENT,
  };
}

export default { options, handler };
