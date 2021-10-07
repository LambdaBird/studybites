import { AuthorizationError } from '../../../validation/errors';

const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
      required: ['refreshToken'],
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
};

async function handler(req) {
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

  const { id, updatedAt } = await User.getUser({ userId: decoded.id });

  const lastUpdateUserTime = Math.floor(new Date(updatedAt).getTime() / 1000);
  const tokenCreatedTime = decoded.iat;
  if (tokenCreatedTime < lastUpdateUserTime) {
    throw new AuthorizationError(errors.USER_ERR_TOKEN_EXPIRED);
  }

  const newAccessToken = createAccessToken(this, id);
  const newRefreshToken = createRefreshToken(this, id);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export default { options, handler };
