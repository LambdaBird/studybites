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
};

async function handler({ params: { id } }) {
  const {
    config: {
      emailService: {
        emailServiceErrors: errors,
        emailServiceMessages: messages,
      },
    },
    redisModel: Redis,
  } = this;

  const verified = await Redis.getEmailByUuid({ uuid: id });
  if (!verified) {
    throw new BadRequestError(errors.EMAIL_ERR_VERIFY);
  }

  return {
    message: messages.EMAIL_MESSAGE_LINK_VERIFIED,
  };
}

export default { options, handler };
