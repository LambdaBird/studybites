import {
  AuthorizationError,
  BadRequestError,
} from '../../../validation/errors';

import { UNAUTHORIZED } from '../constants';

export const MISSING_ROLE = {
  key: 'access.missing_role',
  message: 'Role is required',
};

export default async function access({
  userId,
  resourceType,
  roleId,
  resourceId,
  status,
}) {
  try {
    const {
      models: { UserRole, Lesson },
    } = this;

    if (!roleId) {
      throw new BadRequestError(MISSING_ROLE);
    }

    const userRole = await UserRole.query()
      .first()
      .select()
      .skipUndefined()
      .where({
        userId,
        roleId,
        resourceType,
        resourceId,
      });

    if (!userRole) {
      throw new AuthorizationError(UNAUTHORIZED);
    }

    if (resourceId && status) {
      const lesson = await Lesson.query()
        .findById(resourceId)
        .whereIn('status', status);

      if (!lesson) {
        throw new AuthorizationError(UNAUTHORIZED);
      }
    }
  } catch (error) {
    throw new AuthorizationError(UNAUTHORIZED);
  }
}
