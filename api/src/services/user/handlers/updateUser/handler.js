import { hashPassword } from '../../../../../utils/salt';

import { BadRequestError } from '../../../../validation/errors';

export async function updateUserHandler({
  params: { userId },
  user: { id },
  body,
}) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  let hash;

  if (body.password) {
    hash = await hashPassword(body.password);
  }

  const data = await User.updateOne({
    userId,
    userData: { ...body, password: hash },
  });

  return { data };
}
