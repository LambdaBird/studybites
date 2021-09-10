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
  resourcesId,
}) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { UserRole, Lesson },
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
      })
      .whereIn('resource_id', resourcesId);

    if (!userRole) {
      throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
    }

    if (resourceId && status) {
      const lesson = await Lesson.query()
        .findById(resourceId)
        .whereIn('status', status);

      if (!lesson) {
        throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
      }
    }
  } catch (error) {
    throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
  }
}
