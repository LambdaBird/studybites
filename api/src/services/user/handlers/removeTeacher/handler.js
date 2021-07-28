import { BadRequestError, NotFoundError } from '../../../../validation/errors';

export async function removeTeacherHandler({
  body: { id },
  user: { id: userId },
}) {
  const {
    config: {
      globals: { roles },
      userService: { userServiceErrors: errors, userServiceMessages: messages },
    },
    models: { UserRole },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  const result = await UserRole.query().delete().where({
    userId: id,
    roleId: roles.TEACHER.id,
  });

  if (!result) {
    throw new NotFoundError(errors.USER_ERR_ROLE_NOT_FOUND);
  }

  return { message: messages.USER_MSG_SUCCESS_ALTER_ROLE };
}
