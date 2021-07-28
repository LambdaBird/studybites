import { AuthorizationError } from '../../../../validation/errors';

import { createAccessToken, createRefreshToken } from '../../utils';

export async function refreshTokenHandler(req) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
  } = this;

  const { refreshToken } = req.body;

  const decoded = await this.jwt.decode(refreshToken);

  if (Date.now() >= decoded.exp * 1000) {
    throw new AuthorizationError(errors.USER_ERR_TOKEN_EXPIRED);
  }

  const userData = await User.query().findById(decoded.id);

  if (!userData) {
    throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
  }

  const newAccessToken = createAccessToken(this, userData);
  const newRefreshToken = createRefreshToken(this, userData);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
