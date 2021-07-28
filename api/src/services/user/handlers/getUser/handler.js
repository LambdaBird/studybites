import { BadRequestError, NotFoundError } from '../../../../validation/errors';

export async function getUserHandler({ params: { userId }, user: { id } }) {
  const {
    config: {
      userService: {
        userServiceErrors: errors,
        userServiceConstants: constants,
      },
    },
    models: { User },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  const data = await User.query()
    .findById(userId)
    .select(constants.USER_CONST_ALLOWED_ADMIN_FIELDS);
  if (!data) {
    throw new NotFoundError(errors.USER_ERR_USER_NOT_FOUND);
  }

  return { data };
}
