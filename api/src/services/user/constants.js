/**
 * Error messages
 */

export const UNAUTHORIZED = {
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

/**
 * Success messages
 */

export const USER_DELETED = {
  key: 'admin.user.deleted',
  message: 'User deleted successfully',
};

/**
 * Enums
 */

export const USER_FIELDS = ['id', 'email', 'firstName', 'secondName'];

export const USER_ADMIN_FIELDS = [
  'id',
  'email',
  'firstName',
  'secondName',
  'isConfirmed',
  'isSuperAdmin',
];
