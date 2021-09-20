import { hashPassword } from '../../../../utils/salt';
import { emailServiceErrors } from '../../../config/emailService';
import { BadRequestError } from '../../../validation/errors';
import { emailUtils } from '../../../utils/email';
import { CONSOLE_AND_EMAIL, DEBUG_EMAIL, ONLY_CONSOLE } from '../../../config';
import { redisClient, redisGetAsync } from '../../../redisClient';

const options = {
  schema: {
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    try {
      await this.auth({ req });
    } catch (e) {
      // do nothing
    }
  },
};

const getEmailByUuid = async (toUuid) => {
  return new Promise((resolve) => {
    redisClient.keys('*', async (err, data) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const email of data) {
        // eslint-disable-next-line no-await-in-loop
        const d = (await redisGetAsync(email)) || '{}';
        try {
          const { uuid } = JSON.parse(d);
          if (uuid === toUuid) {
            resolve(email);
          }
        } catch (e) {
          // do nothing;
        }
      }
    });
  });
};

async function handler({ user, params: { id: uuid }, body: { password } }) {
  let userId = user?.id;
  const {
    models: { User },
    createAccessToken,
    createRefreshToken,
  } = this;
  let email;
  if (!userId) {
    email = await getEmailByUuid(uuid);
    const { id } = (await User.getUserByEmail({ email }))?.[0];
    userId = id;
  } else {
    const result = await User.getUser({ userId });
    email = result?.email;
  }

  const verified = await emailUtils.verifyPasswordReset({ email, uuid });
  if (!verified) {
    throw new BadRequestError(emailServiceErrors.EMAIL_ERR_VERIFY);
  }

  const hash = await hashPassword(password);

  await User.updatePassword({
    password: hash,
    userId,
  });

  const accessToken = createAccessToken(this, userId);
  const refreshToken = createRefreshToken(this, userId);

  await emailUtils.invalidateLink({ email, uuid });

  const message = await emailUtils.sendPasswordChanged({ email });
  if (DEBUG_EMAIL === ONLY_CONSOLE || DEBUG_EMAIL === CONSOLE_AND_EMAIL) {
    // eslint-disable-next-line no-console
    console.log(message); // TODO log email
  }
  return { accessToken, refreshToken };
}

export default { options, handler };
