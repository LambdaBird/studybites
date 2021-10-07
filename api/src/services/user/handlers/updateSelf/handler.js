import { BadRequestError } from '../../../../validation/errors';

export async function updateSelfHandler({
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
