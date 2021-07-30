import { hashPassword } from '../../../../../utils/salt';

export async function signUpHandler({ body }) {
  const {
    models: { User },
    createAccessToken,
    createRefreshToken,
  } = this;

  const hash = await hashPassword(body.password);

  const { id } = await User.createOne({
    userData: { ...body, password: hash },
  });

  const accessToken = createAccessToken(this, id);
  const refreshToken = createRefreshToken(this, id);

  return {
    accessToken,
    refreshToken,
  };
}
