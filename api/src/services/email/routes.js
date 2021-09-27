import resetPassword from './controllers/resetPassword';
import resetPasswordNoAuth from './controllers/resetPasswordNoAuth';
import updatePassword from './controllers/updatePassword';
import updatePasswordNoAuth from './controllers/updatePasswordNoAuth';
import verifyPasswordReset from './controllers/verifyPasswordReset';
import verifyPasswordResetNoAuth from './controllers/verifyPasswordResetNoAuth';

export async function router(instance) {
  instance.post(
    '/reset-password',
    resetPassword.options,
    resetPassword.handler,
  );

  instance.post(
    '/reset-password-no-auth',
    resetPasswordNoAuth.options,
    resetPasswordNoAuth.handler,
  );

  instance.get(
    '/verify-password-reset/:id',
    verifyPasswordReset.options,
    verifyPasswordReset.handler,
  );
  instance.get(
    '/verify-password-reset-no-auth/:id',
    verifyPasswordResetNoAuth.options,
    verifyPasswordResetNoAuth.handler,
  );

  instance.put(
    '/update-password/:id',
    updatePassword.options,
    updatePassword.handler,
  );

  instance.put(
    '/update-password-no-auth/:id',
    updatePasswordNoAuth.options,
    updatePasswordNoAuth.handler,
  );
}
