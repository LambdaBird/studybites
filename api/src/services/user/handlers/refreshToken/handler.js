import { AuthorizationError } from '../../../../validation/errors';

export async function refreshTokenHandler(req) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
    createAccessToken,
    createRefreshToken,
  } = this;

  const { refreshToken } = req.body;

  const decoded = await this.jwt.decode(refreshToken);

  if (Date.now() >= decoded.exp * 1000) {
    throw new AuthorizationError(errors.USER_ERR_TOKEN_EXPIRED);
  }

  const { id } = await User.getUser({ userId: decoded.id });

  const newAccessToken = createAccessToken(this, id);
  const newRefreshToken = createRefreshToken(this, id);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
