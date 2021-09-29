import resetPassword from './controllers/resetPassword';
import resetPasswordNoAuth from './controllers/resetPasswordNoAuth';
import updatePassword from './controllers/updatePassword';
import verifyPasswordReset from './controllers/verifyPasswordReset';

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

  instance.put(
    '/update-password/:id',
    updatePassword.options,
    updatePassword.handler,
  );
}
