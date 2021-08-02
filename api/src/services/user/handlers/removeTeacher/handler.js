import { BadRequestError } from '../../../../validation/errors';

export async function removeTeacherHandler({
  body: { id },
  user: { id: userId },
}) {
  const {
    config: {
      userService: { userServiceErrors: errors, userServiceMessages: messages },
    },
    models: { UserRole },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  await UserRole.removeTeacher({ userId: id });

  return { message: messages.USER_MSG_SUCCESS_ALTER_ROLE };
}
