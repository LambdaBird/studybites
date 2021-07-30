export const userServiceErrors = {
  USER_ERR_UNAUTHORIZED: 'errors.unauthorized',
  USER_ERR_TOKEN_EXPIRED: 'errors.token_expired',
  USER_ERR_INVALID_USER_ID: 'errors.invalid_user_id',
  USER_ERR_ALREADY_REGISTERED: 'errors.user_already_registered',
  USER_ERR_USER_NOT_FOUND: 'errors.user_not_found',
  USER_ERR_INVALID_UPDATE: 'errors.invalid_update',
  USER_ERR_ROLE_NOT_FOUND: 'errors.role_not_found',
  USER_ERR_FAIL_ALTER_ROLE: 'errors.fail_alter_role',
  USER_ERR_MISSING_ROLE: 'errors.missing_role',
};

export const userServiceMessages = {
  USER_MSG_USER_DELETED: 'messages.user_deleted',
  USER_MSG_SUCCESS_ALTER_ROLE: 'messages.success_alter_role',
  USER_MSG_ROLE_DELETED: 'messages.role_deleted',
};

export const userServiceConstants = {
  USER_CONST_ALLOWED_USER_FIELDS: ['id', 'email', 'firstName', 'lastName'],
  USER_CONST_ALLOWED_ADMIN_FIELDS: [
    'id',
    'email',
    'firstName',
    'lastName',
    'isConfirmed',
    'isSuperAdmin',
  ],
};