import { emailUtils } from '../../../utils/email';
import { redisGetAsync, redisTtlAsync } from '../../../redisClient';
import { emailServiceErrors } from '../../../config/emailService';
import { CONSOLE_AND_EMAIL, DEBUG_EMAIL, ONLY_CONSOLE } from '../../../config';

const options = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {},
      },
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
  const { uuid } = JSON.parse((await redisGetAsync(email)) || '{}');
  if (uuid) {
    const isNotAllowed = await redisGetAsync(uuid);
    if (isNotAllowed) {
      const timeout = await redisTtlAsync(uuid);
      return reply.status(400).send({
        statusCode: 400,
        message: emailServiceErrors.EMAIL_ERR_TOO_FREQUENTLY,
        payload: { timeout },
      });
    }
  }
  const link = await emailUtils.generateLink({ email, host });
  const message = await emailUtils.sendResetPassword({ email, link });
  if (DEBUG_EMAIL === ONLY_CONSOLE || DEBUG_EMAIL === CONSOLE_AND_EMAIL) {
    // eslint-disable-next-line no-console
    console.log(message); // TODO log email
  }
  return {};
}

export default { options, handler };
