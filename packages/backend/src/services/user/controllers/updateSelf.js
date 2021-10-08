import { BadRequestError } from '../../../validation/errors';
import { userConstants } from '../../../config';

export const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: userConstants.MAX_FIRST_NAME_LENGTH,
        },
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: userConstants.MAX_LAST_NAME_LENGTH,
        },
        description: {
          type: 'string',
          maxLength: userConstants.MAX_DESCRIPTION_LENGTH,
        },
      },
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
};

export async function handler({
  user: { id: userId },
  body: { firstName, lastName, description },
}) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
  } = this;
  const firstNameTrimmed = firstName?.trim?.();
  const lastNameTrimmed = lastName?.trim?.();
  const descriptionTrimmed = description?.trim?.();

  const anySpaceRegex = /\s/g;
  if (
    anySpaceRegex.test(firstNameTrimmed) ||
    anySpaceRegex.test(lastNameTrimmed)
  ) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_BODY);
  }

  const updatedUser = await User.updateSelf({
    userId,
    user: {
      firstName: firstNameTrimmed,
      lastName: lastNameTrimmed,
      description: descriptionTrimmed,
    },
  });

  return { ...updatedUser };
}

export default { options, handler };
