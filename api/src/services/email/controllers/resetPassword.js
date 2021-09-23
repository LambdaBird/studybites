import { emailUtils } from '../../../../utils/email';
import { emailServiceErrors } from '../../../config';

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

async function handler({ user: { id: userId }, headers }, reply) {
  const {
    models: { User },
  } = this;
  const host = headers['x-forwarded-host'];
  const { email } = await User.getUser({ userId });

  const { allowed, timeout } = await emailUtils.getResetPasswordAllowed({
    email,
  });

  if (!allowed) {
    return reply.status(400).send({
      statusCode: 400,
      message: emailServiceErrors.EMAIL_ERR_TOO_FREQUENTLY,
      payload: { timeout },
    });
  }

  const link = await emailUtils.generateLink({ host, email });
  await emailUtils.sendResetPassword({ email, link });
  return {};
}

export default { options, handler };
