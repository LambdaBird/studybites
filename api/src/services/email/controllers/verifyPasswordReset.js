import { emailUtils } from '../../../utils/email';
import { emailServiceErrors } from '../../../config/emailService';
import { BadRequestError } from '../../../validation/errors';

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

async function handler({ user: { id: userId }, params: { id } }) {
  const {
    models: { User },
  } = this;
  const { email } = await User.getUser({ userId });

  const verified = await emailUtils.verifyPasswordReset({ email, uuid: id });
  if (!verified) {
    throw new BadRequestError(emailServiceErrors.EMAIL_ERR_VERIFY);
  }

  return {};
}

export default { options, handler };
