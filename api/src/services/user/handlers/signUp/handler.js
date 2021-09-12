import { roles } from '../../../../config';
import { hashPassword } from '../../../../../utils/salt';

export async function signUpHandler({ body }) {
  const {
    models: { User, UserRole },
    createAccessToken,
    createRefreshToken,
  } = this;

  const hash = await hashPassword(body.password);

  const { id } = await User.createOne({
    userData: { ...body, password: hash },
  });

  if (process.env.DEMO_MODE) {
    await UserRole.query()
      .insert({
        userID: id,
        roleID: roles.TEACHER.id,
      })
      .returning('*');
  }

  const accessToken = createAccessToken(this, id);
  const refreshToken = createRefreshToken(this, id);

  return {
    accessToken,
    refreshToken,
  };
}
