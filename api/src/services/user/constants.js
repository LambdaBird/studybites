/**
 * Error messages
 */

export const UNAUTHORIZED = 'errors.unauthorized';

export const REFRESH_TOKEN_EXPIRED = 'errors.refresh_token_expired';

export const INVALID_ID = 'admin.user.invalid_id';

export const USER_ALREADY_REGISTERED = 'sign_up.email.already_registered';

export const USER_NOT_FOUND = 'admin.user.not_found';

export const INVALID_PATCH = 'admin.user.invalid_patch';

export const INVALID_EMAIL = 'errors.email_format_err';

export const INVALID_PASSWORD = 'errors.password_regexp_err';

export const USER_ROLE_NOT_FOUND = 'admin.user.role_not_found';

export const ALTER_ROLE_FAIL = 'admin.user.alter_fail';

/**
 * Success messages
 */

export const USER_DELETED = 'admin.user.deleted';

export const ALTER_ROLE_SUCCESS = 'admin.user.alter_role';

export const USER_ROLE_DELETED = 'admin.user.role_deleted';

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
