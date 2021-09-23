import resetPassword from './controllers/resetPassword';
import resetPasswordNoAuth from './controllers/resetPasswordNoAuth';
import updatePassword from './controllers/updatePassword';
import updatePasswordNoAuth from './controllers/updatePasswordNoAuth';
import verifyPasswordReset from './controllers/verifyPasswordReset';

export async function router(instance) {
  instance.post(
    '/reset_password',
    resetPassword.options,
    resetPassword.handler,
  );

  instance.post(
    '/reset_password_no_auth',
    resetPasswordNoAuth.options,
    resetPasswordNoAuth.handler,
  );

  instance.get(
    '/verify_password_reset/:id',
    verifyPasswordReset.options,
    verifyPasswordReset.handler,
  );

  instance.put(
    '/update_password/:id',
    updatePassword.options,
    updatePassword.handler,
  );

  instance.put(
    '/update_password_no_auth/:id',
    updatePasswordNoAuth.options,
    updatePasswordNoAuth.handler,
  );
}
