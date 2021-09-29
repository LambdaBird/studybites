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
    emailUtils: { getEmailConfirmByUuid, invalidateConfirmationLink },
  } = this;
  const email = await getEmailConfirmByUuid({ uuid: id });
  if (!email) {
    throw new BadRequestError(errors.EMAIL_ERR_VERIFY);
  }
  const { id: userId, isConfirmed } = await User.getUserByEmail({ email });
  if (isConfirmed) {
    throw new BadRequestError(errors.EMAIL_ERR_ALREADY_VERIFIED);
  }
  await User.updateOne({ userData: { isConfirmed: true }, userId });
  await invalidateConfirmationLink({ email, uuid: id });
  return {
    message: messages.EMAIL_MESSAGE_EMAIL_VERIFIED,
  };
}

export default { options, handler };
