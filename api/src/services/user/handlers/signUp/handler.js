import { hashPassword } from '../../../../../utils/salt';

import { createAccessToken, createRefreshToken } from '../../utils';

export async function signUpHandler(req) {
  const {
    models: { User },
  } = this;

  req.body.password = await hashPassword(req.body.password);

  const userData = await User.query().insert(req.body).returning('*');

  const accessToken = createAccessToken(this, userData);
  const refreshToken = createRefreshToken(this, userData);

  return {
    accessToken,
    refreshToken,
  };
}
