import { AuthorizationError, BadRequestError } from '../../validation/errors';

import { UNAUTHORIZED } from './constants';

export const MISSING_ROLE = {
  key: 'access.missing_role',
  message: 'Role is required',
};

const access =
  ({ instance, type, role, getId = () => undefined, status }) =>
  async (req) => {
    try {
      const { UserRole, Lesson } = instance.models;

      if (!role) {
        throw new BadRequestError(MISSING_ROLE);
      }

      const id = getId(req);

      const data = await UserRole.query().select().skipUndefined().where({
        userID: req.user.id,
        roleID: role,
        resourceType: type,
        resourceId: id,
      });

      if (!data.length) {
        throw new AuthorizationError(UNAUTHORIZED);
      }

      if (id && status) {
        const lesson = await Lesson.query()
          .findById(id)
          .whereIn('status', status);

        if (!lesson) {
          throw new AuthorizationError(UNAUTHORIZED);
        }
      }
    } catch (err) {
      throw new AuthorizationError(UNAUTHORIZED);
    }
  };

export default access;
