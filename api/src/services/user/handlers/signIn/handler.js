import { comparePasswords } from '../../../../../utils/salt';
import { AuthorizationError } from '../../../../validation/errors';

export async function signInHandler({ body: { email, password } }) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
    createAccessToken,
    createRefreshToken,
  } = this;

  const { id, password: userPassword } = await User.checkIfExist({ email });

  const compareResult = await comparePasswords(password, userPassword);
  if (!compareResult) {
    throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
  }

  const accessToken = createAccessToken(this, id);
  const refreshToken = createRefreshToken(this, id);

  return {
    accessToken,
    refreshToken,
  };
}
