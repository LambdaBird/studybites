import {
  AuthorizationError,
  BadRequestError,
} from '../../../validation/errors';

export default async function access({
  userId,
  resourceType,
  roleId,
  resourceId,
  status,
}) {
  const {
    config: {
      userService: { userServiceErrors: errors },
      globals: { resources },
    },
    models: { UserRole, Lesson, Course },
  } = this;

  try {
    if (!roleId) {
      throw new BadRequestError(errors.USER_ERR_MISSING_ROLE);
    }

    const userRole = await UserRole.query()
      .first()
      .select()
      .skipUndefined()
      .where({
        user_id: userId,
        role_id: roleId,
        resource_type: resourceType,
        resource_id: resourceId,
      });

    if (!userRole) {
      throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
    }

    if (resourceId && status) {
      if (resourceType === resources.LESSON.name) {
        const lesson = await Lesson.query()
          .findById(resourceId)
          .whereIn('status', status);

        if (!lesson) {
          throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
        }
      } else {
        const course = await Course.query()
          .findById(resourceId)
          .whereIn('status', status);

        if (!course) {
          throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
        }
      }
    }
  } catch (error) {
    throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
  }
}
