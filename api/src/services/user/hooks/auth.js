import { AuthorizationError } from '../../../validation/errors';

export default async function auth({ req, isAdminOnly = false }) {
  const {
    config: {
      userService: {
        userServiceErrors: { USER_ERR_UNAUTHORIZED },
      },
    },
    models: { User },
  } = this;

  try {
    const { access, id } = await req.jwtVerify();
    if (!access) {
      throw new AuthorizationError(USER_ERR_UNAUTHORIZED);
    }

    const user = await User.query().findById(id);
    if (!user) {
      throw new AuthorizationError(USER_ERR_UNAUTHORIZED);
    }

    if (isAdminOnly) {
      if (!user.isSuperAdmin) {
        throw new AuthorizationError(USER_ERR_UNAUTHORIZED);
      }
    }
  } catch (error) {
    throw new AuthorizationError(USER_ERR_UNAUTHORIZED);
  }
}
