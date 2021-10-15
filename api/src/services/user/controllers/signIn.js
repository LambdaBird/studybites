import { comparePasswords } from '../../../../utils/salt';
import { AuthorizationError } from '../../../validation/errors';

const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
};

async function handler({ body: { email, password } }) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
    createAccessToken,
    createRefreshToken,
  } = this;

  const { id, password: userPassword } = await User.checkIfExist({
    email: email.toLowerCase(),
  });

  const compareResult = await comparePasswords(password, userPassword);
  if (!compareResult) {
    throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
  }

  const accessToken = createAccessToken(this, id, email);
  const refreshToken = createRefreshToken(this, id);

  return {
    accessToken,
    refreshToken,
  };
}

export default { options, handler };
