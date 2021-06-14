import { AuthorizationError, BadRequestError } from '../../validation/errors';

import { UNAUTHORIZED } from './constants';

export const MISSING_ROLE = {
  key: 'access.missing_role',
  message: 'Role is required',
};

const access =
  ({ instance, type, role, getId = () => undefined }) =>
  async (req) => {
    try {
      const { UserRole } = instance.models;

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
    } catch (err) {
      throw new AuthorizationError(UNAUTHORIZED);
    }
  };

export default access;
