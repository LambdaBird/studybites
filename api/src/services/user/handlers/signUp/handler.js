import { hashPassword } from '../../../../../utils/salt';

export async function signUpHandler({ body, headers }) {
  const {
    models: { User },
    createAccessToken,
    createRefreshToken,
    emailModel: Email,
    redisModel: Redis,
  } = this;
  const host = headers['x-forwarded-host'];
  const hash = await hashPassword(body.password);

  const { id, email, language } = await User.createOne({
    userData: { ...body, password: hash },
  });

  const accessToken = createAccessToken(this, id);
  const refreshToken = createRefreshToken(this, id);

  const link = await Redis.generateConfirmationLink({ host, email });
  await Email.sendEmailConfirmation({ email, link, language });

  return {
    accessToken,
    refreshToken,
  };
}
