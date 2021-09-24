import { BadRequestError } from '../../../validation/errors';
import { emailUtils } from '../../../../utils/email';
import { emailServiceErrors } from '../../../config';

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
  const verified = await emailUtils.getEmailByUuid({ uuid: id });
  if (!verified) {
    throw new BadRequestError(emailServiceErrors.EMAIL_ERR_VERIFY);
  }

  return {
    message: 'Link verified successfully',
  };
}

export default { options, handler };
