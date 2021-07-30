import { BadRequestError } from '../../../../validation/errors';

export async function getUserHandler({ params: { userId }, user: { id } }) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  const data = await User.getUser({ userId });

  return { data };
}
