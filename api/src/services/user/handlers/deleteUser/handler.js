import { BadRequestError, NotFoundError } from '../../../../validation/errors';

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

  const result = await User.query().deleteById(userId);

  if (!result) {
    throw new NotFoundError(errors.USER_ERR_USER_NOT_FOUND);
  }

  return { message: messages.USER_MSG_USER_DELETED };
}
