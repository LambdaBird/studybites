import { comparePasswords } from '../../../../../utils/salt';
import { AuthorizationError } from '../../../../validation/errors';

import { createAccessToken, createRefreshToken } from '../../utils';

export async function signInHandler(req) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
  } = this;

  const { email, password } = req.body;

  const userData = await User.query().findOne({
    email,
  });
  if (!userData) {
    throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
  }

  const compareResult = await comparePasswords(password, userData.password);
  if (!compareResult) {
    throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
  }

  const accessToken = createAccessToken(this, userData);
  const refreshToken = createRefreshToken(this, userData);

  return {
    accessToken,
    refreshToken,
  };
}
