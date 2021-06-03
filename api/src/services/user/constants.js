export const INVALID_EMAIL = 'Property "email" is invalid';

export const INVALID_PASSWORD =
  'Property "password" must be longer than 5 characters and contain at least one number and one letter';

export const UNAUTHORIZED = {
  fallback: 'errors.unauthorized',
  errors: [
    {
      message: 'Unauthorized',
    },
  ],
};

export const INVALID_ID = {
  key: 'admin.user.invalid_id',
  message: 'Invalid user id',
};

export const USER_ALREADY_REGISTERED = {
  fallback: 'errors.unique_violation',
  errors: [
    {
      key: 'sign_up.email.already_registered',
      message: 'This email was already registered',
    },
  ],
};

export const USER_NOT_FOUND = {
  fallback: 'errors.not_found',
  errors: [
    {
      key: 'admin.user.not_found',
      message: 'User not found',
    },
  ],
};

export const INVALID_PATCH = {
  fallback: 'errors.bad_request',
  errors: [
    {
      key: 'admin.user.invalid_patch',
      message: 'Invalid PATCH request',
    },
  ],
};

export const USER_DELETED = {
  key: 'admin.user.deleted',
  message: 'User deleted successfully',
};

export const USER_ADMIN_FIELDS = [
  'id',
  'email',
  'firstName',
  'secondName',
  'isConfirmed',
  'isSuperAdmin',
];

export const ALTER_ROLE_SUCCESS = {
  key: 'admin.user.alter_role',
  message: 'Role changed successfully',
};

export const ALTER_ROLE_FAIL = {
  fallback: 'errors.bad_request',
  errors: [
    {
      key: 'admin.user.alter_fail',
      message: 'User already has this role',
    },
  ],
};

export const USER_ROLE_NOT_FOUND = {
  fallback: 'errors.not_found',
  errors: [
    {
      key: 'admin.user.role_not_found',
      message: 'User`s role not found',
    },
  ],
};

export const USER_ROLE_DELETED = {
  key: 'admin.user.role_deleted',
  message: 'User`s role deleted successfully',
};
