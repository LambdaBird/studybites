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
    emailUtils: {
      getResetPasswordAllowedNoAuth,
      setUserIp,
      generateLink,
      sendResetPassword,
    },
  } = this;
  const host = headers['x-forwarded-host'];
  const userIp = socket.remoteAddress || headers['x-forwarded-for'];
  const { allowed, timeout } = await getResetPasswordAllowedNoAuth({
    userIp,
  });
  if (!allowed) {
    throw new BadRequestWithPayloadError(errors.EMAIL_ERR_TOO_FREQUENTLY, {
      timeout,
    });
  }
  await setUserIp({ userIp });
  try {
    await User.getUserByEmail({ email });
  } catch (e) {
    // Do nothing if user not found with this email
    return { message: messages.EMAIL_MESSAGE_LINK_SENT };
  }

  const link = await generateLink({ host, email });
  await sendResetPassword({ email, link });
  return { message: messages.EMAIL_MESSAGE_LINK_SENT };
}

export default { options, handler };
