import { BadRequestError } from '../../../../validation/errors';

export async function deleteUserHandler({ params: { userId }, user: { id } }) {
  const {
    config: {
      userService: { userServiceErrors: errors, userServiceMessages: messages },
    },
    models: { User },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  await User.deleteUser({ userId });

  return { message: messages.USER_MSG_USER_DELETED };
}
