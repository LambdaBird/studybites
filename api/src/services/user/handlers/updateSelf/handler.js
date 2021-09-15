import { BadRequestError } from '../../../../validation/errors';
import { userServiceErrors as errors } from '../../../../config';

export async function updateSelfHandler({
  user: { id: userId },
  body: { firstName, lastName, email },
}) {
  const {
    models: { User },
  } = this;
  const firstNameTrimmed = firstName?.trim?.();
  const lastNameTrimmed = lastName?.trim?.();
  const emailTrimmed = email?.trim?.();

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
      email: emailTrimmed,
    },
  });

  return { ...updatedUser };
}
