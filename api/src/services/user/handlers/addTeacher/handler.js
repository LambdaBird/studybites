import { BadRequestError } from '../../../../validation/errors';

export async function addTeacherHandler({
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

  const check = await UserRole.query().findOne({
    userId: id,
    roleId: roles.TEACHER.id,
  });

  if (check) {
    throw new BadRequestError(errors.USER_ERR_FAIL_ALTER_ROLE);
  }

  await UserRole.query()
    .insert({
      userId: id,
      roleId: roles.TEACHER.id,
    })
    .returning('*');

  return { message: messages.USER_MSG_SUCCESS_ALTER_ROLE };
}
