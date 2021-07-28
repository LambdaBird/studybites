export const userServiceErrors = {
  USER_ERR_UNAUTHORIZED: 'user.error.unauthorized',
  USER_ERR_TOKEN_EXPIRED: 'user.error.token_expired',
  USER_ERR_INVALID_USER_ID: 'user.error.invalid_user_id',
  USER_ERR_ALREADY_REGISTERED: 'user.error.user_already_registered',
  USER_ERR_USER_NOT_FOUND: 'user.error.user_not_found',
  USER_ERR_INVALID_UPDATE: 'user.error.invalid_update',
  USER_ERR_ROLE_NOT_FOUND: 'user.error.role_not_found',
  USER_ERR_FAIL_ALTER_ROLE: 'user.error.fail_alter_role',
  USER_ERR_MISSING_ROLE: 'user.error.missing_role',
};

export const userServiceMessages = {
  USER_MSG_USER_DELETED: 'user.message.user_deleted',
  USER_MSG_SUCCESS_ALTER_ROLE: 'user.message.success_alter_role',
  USER_MSG_ROLE_DELETED: 'user.message.role_deleted',
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
