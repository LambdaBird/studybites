import { emailUtils } from '../../../../utils/email';
import { emailServiceErrors } from '../../../config';

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

async function handler({ body: { email }, socket, headers }, reply) {
  const {
    models: { User },
  } = this;
  const host = headers['x-forwarded-host'];
  const userIp = socket.remoteAddress || headers['x-forwarded-for'];
  const { allowed, timeout } = await emailUtils.getResetPasswordAllowedNoAuth({
    userIp,
  });
  if (!allowed) {
    return reply.status(400).send({
      statusCode: 400,
      message: emailServiceErrors.EMAIL_ERR_TOO_FREQUENTLY,
      payload: { timeout },
    });
  }
  await emailUtils.setUserIp({ userIp });
  try {
    await User.getUserByEmail({ email });
  } catch (e) {
    // Do nothing if user not found with this email
    return {};
  }

  const link = await emailUtils.generateLink({ host, email });
  await emailUtils.sendResetPassword({ email, link });
  return {};
}

export default { options, handler };
