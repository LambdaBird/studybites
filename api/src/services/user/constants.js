/**
 * Error messages
 */

export const UNAUTHORIZED = {
  key: 'errors.unauthorized',
  message: 'Unauthorized',
};

export const INVALID_ID = {
  key: 'admin.user.invalid_id',
  message: 'Invalid user id',
};

export const USER_ALREADY_REGISTERED = {
  key: 'sign_up.email.already_registered',
  message: 'This email was already registered',
};

export const USER_NOT_FOUND = {
  key: 'admin.user.not_found',
  message: 'User not found',
};

export const INVALID_PATCH = {
  key: 'admin.user.invalid_patch',
  message: 'Invalid PATCH request',
};

export const INVALID_EMAIL = {
  key: 'errors.email_format_err',
  message: 'Property "email" is invalid',
};

export const INVALID_PASSWORD = {
  key: 'errors.password_regexp_err',
  message:
    'Property "password" must be longer than 5 characters and contain at least one number and one letter',
};

export const USER_ROLE_NOT_FOUND = {
  key: 'admin.user.role_not_found',
  message: "User's role not found",
};

export const ALTER_ROLE_FAIL = {
  key: 'admin.user.alter_fail',
  message: 'User already has this role',
};

/**
 * Success messages
 */

export const USER_DELETED = {
  key: 'admin.user.deleted',
  message: 'User deleted successfully',
};

export const ALTER_ROLE_SUCCESS = {
  key: 'admin.user.alter_role',
  message: 'Role changed successfully',
};

export const USER_ROLE_DELETED = {
  key: 'admin.user.role_deleted',
  message: 'Role deleted successfully',
};

/**
 * Enums
 */

export const USER_FIELDS = ['id', 'email', 'firstName', 'lastName'];

export const USER_ADMIN_FIELDS = [
  'id',
  'email',
  'firstName',
  'lastName',
  'isConfirmed',
  'isSuperAdmin',
];
