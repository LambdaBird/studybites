import { AuthorizationError } from '../../../validation/errors';

import { UNAUTHORIZED } from '../constants';

export default async function auth({ req, isAdminOnly = false }) {
  try {
    const {
      models: { User },
    } = this;

    const { access, id } = await req.jwtVerify();
    if (!access) {
      throw new AuthorizationError(UNAUTHORIZED);
    }

    const user = await User.query().findById(id);
    if (!user) {
      throw new AuthorizationError(UNAUTHORIZED);
    }

    if (isAdminOnly) {
      if (!user.isSuperAdmin) {
        throw new AuthorizationError(UNAUTHORIZED);
      }
    }
  } catch (error) {
    throw new AuthorizationError(UNAUTHORIZED);
  }
}
