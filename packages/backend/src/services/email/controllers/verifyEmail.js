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
    models: { User },
    config: {
      emailService: {
        emailServiceErrors: errors,
        emailServiceMessages: messages,
      },
    },
    redisModel: Redis,
  } = this;
  const email = await Redis.getEmailConfirmByUuid({ uuid: id });
  if (!email) {
    throw new BadRequestError(errors.EMAIL_ERR_VERIFY);
  }
  const { id: userId, isConfirmed } = await User.getUserByEmail({ email });
  if (isConfirmed) {
    throw new BadRequestError(errors.EMAIL_ERR_ALREADY_VERIFIED);
  }
  await User.updateOne({ userData: { isConfirmed: true }, userId });
  await Redis.invalidateConfirmationLink({ email, uuid: id });
  return {
    message: messages.EMAIL_MESSAGE_EMAIL_VERIFIED,
  };
}

export default { options, handler };
