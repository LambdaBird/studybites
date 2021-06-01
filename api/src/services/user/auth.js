import { AuthorizationError } from '../../validation/errors';

import { UNAUTHORIZED } from './constants';

const auth =
  ({ instance, isAdminOnly = false }) =>
  // eslint-disable-next-line consistent-return
  async (req) => {
    try {
      const { User } = instance.models;

      const decoded = await req.jwtVerify();
      req.userId = decoded.id;

      if (!decoded.access) {
        throw new AuthorizationError(UNAUTHORIZED);
      }

      const userData = await User.query().findOne({
        id: decoded.id,
      });

      if (!userData) {
        throw new AuthorizationError(UNAUTHORIZED);
      }

      if (isAdminOnly) {
        if (!userData.isSuperAdmin) {
          throw new AuthorizationError(UNAUTHORIZED);
        }
      }
    } catch (err) {
      throw new AuthorizationError(UNAUTHORIZED);
    }
  };

export default auth;
