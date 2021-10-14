import { v4 } from 'uuid';
import { emailTimes } from '../../../config';

const CHANGE_PASSWORD_PATH = 'change-password';
const VERIFY_EMAIL_PATH = 'verify-email';

class TokenStorage {
  static redisClient;

  static async invalidateLink({ email, uuid }) {
    await TokenStorage.redisClient.del(email);
    await TokenStorage.redisClient.del(uuid);
    await TokenStorage.redisClient.del(`${uuid}-email`);
  }

  static async generateLink({ host: frontHost, email }) {
    const uuid = v4();
    await TokenStorage.redisClient.set(
      email,
      uuid,
      'EX',
      emailTimes.RESET_LINK_EXPIRE_TIME,
    );
    await TokenStorage.redisClient.set(
      `${uuid}-email`,
      email,
      'EX',
      emailTimes.RESET_LINK_EXPIRE_TIME,
    );
    await TokenStorage.redisClient.set(
      uuid,
      true,
      'EX',
      emailTimes.AGAIN_GENERATE_LINK_NOT_ALLOWED_TIME,
    );
    return `${frontHost}/${CHANGE_PASSWORD_PATH}/${uuid}`;
  }

  static async generateConfirmationLink({ host: frontHost, email }) {
    const uuid = v4();
    await TokenStorage.redisClient.set(`${email}-confirm`, uuid);
    await TokenStorage.redisClient.set(`${uuid}-confirm`, email);
    return `${frontHost}/${VERIFY_EMAIL_PATH}/${uuid}`;
  }

  static async invalidateConfirmationLink({ email, uuid }) {
    await TokenStorage.redisClient.del(`${email}-confirm`);
    await TokenStorage.redisClient.del(`${uuid}-confirm`);
  }

  static async getEmailConfirmByUuid({ uuid }) {
    return TokenStorage.redisClient.get(`${uuid}-confirm`);
  }

  static async getEmailByUuid({ uuid }) {
    return TokenStorage.redisClient.get(`${uuid}-email`);
  }

  static async setUserIp({ userIp }) {
    return TokenStorage.redisClient.set(
      userIp,
      true,
      'EX',
      emailTimes.RESET_PASSWORD_NOT_ALLOWED_TIME,
    );
  }

  static async getResetPasswordAllowedNoAuth({ userIp }) {
    const isUserIpNotExpired = await TokenStorage.redisClient.get(userIp);
    if (isUserIpNotExpired) {
      const timeout = await TokenStorage.redisClient.ttl(userIp);
      return {
        allowed: false,
        timeout,
      };
    }
    return {
      allowed: true,
    };
  }

  static async getResetPasswordAllowed({ email }) {
    const uuid = await TokenStorage.redisClient.get(email);
    if (uuid) {
      const isUuidNotExpired = await TokenStorage.redisClient.get(uuid);
      if (isUuidNotExpired) {
        const timeout = await TokenStorage.redisClient.ttl(uuid);
        return {
          allowed: false,
          timeout,
        };
      }
    }
    return {
      allowed: true,
    };
  }
}

export default TokenStorage;
