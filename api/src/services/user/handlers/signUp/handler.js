import { hashPassword } from '../../../../../utils/salt';

export async function signUpHandler({ body, headers }) {
  const {
    models: { User },
    createAccessToken,
    createRefreshToken,
    emailUtils: { generateConfirmationLink, sendEmailConfirmation },
  } = this;
  const host = headers['x-forwarded-host'];
  const hash = await hashPassword(body.password);

  const { id, email } = await User.createOne({
    userData: { ...body, password: hash },
  });

  const accessToken = createAccessToken(this, id);
  const refreshToken = createRefreshToken(this, id);

  const link = await generateConfirmationLink({ host, email });
  await sendEmailConfirmation({ email, link });

  return {
    accessToken,
    refreshToken,
  };
}
