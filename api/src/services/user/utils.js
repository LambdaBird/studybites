import config from '../../config';

export const createAccessToken = (instance, user) =>
  instance.jwt.sign(
    {
      access: true,
      id: user.id,
    },
    { expiresIn: config.jwt.ACCESS_JWT_EXPIRES_IN },
  );

export const createRefreshToken = (instance, user) =>
  instance.jwt.sign(
    {
      access: false,
      id: user.id,
    },
    { expiresIn: config.jwt.REFRESH_JWT_EXPIRES_IN },
  );
