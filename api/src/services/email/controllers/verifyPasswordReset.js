import { BadRequestError } from '../../../validation/errors';

const options = {
  schema: {
    params: { $ref: 'passwordResetId#' },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
};

async function handler({ params: { id } }) {
  const {
    config: {
      emailService: {
        emailServiceErrors: errors,
        emailServiceMessages: messages,
      },
    },
    emailUtils,
  } = this;
  const verified = await emailUtils.getEmailByUuid({ uuid: id });
  if (!verified) {
    throw new BadRequestError(errors.EMAIL_ERR_VERIFY);
  }

  return {
    message: messages.EMAIL_MESSAGE_LINK_VERIFIED,
  };
}

export default { options, handler };