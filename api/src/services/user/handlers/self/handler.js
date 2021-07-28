import { AuthorizationError } from '../../../../validation/errors';

export async function selfHandler(req) {
  const {
    config: {
      userService: {
        userServiceConstants: constants,
        userServiceErrors: errors,
      },
    },
    models: { User, UserRole },
  } = this;

  const userData = await User.query()
    .findById(req.user.id)
    .select([...constants.USER_CONST_ALLOWED_USER_FIELDS, 'isSuperAdmin']);

  if (!userData) {
    throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
  }

  const { isSuperAdmin, ...user } = userData;

  const rolesData = await UserRole.relatedQuery('role')
    .for(UserRole.query().where('user_id', req.user.id))
    .select('name');

  const userRoles = rolesData.map((role) => role.name);

  if (isSuperAdmin) {
    userRoles.push('SuperAdmin');
  }

  return { ...user, roles: userRoles };
}
