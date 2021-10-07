import { v4 } from 'uuid';
import { emailTimes } from '../../../config';

const CHANGE_PASSWORD_PATH = 'change-password';

class TokenStorage {
  static redisClient;

  static async invalidateLink({ email, uuid }) {
    TokenStorage.redisClient.del(email);
    TokenStorage.redisClient.del(uuid);
    TokenStorage.redisClient.del(`${uuid}-email`);
  }

  static async generateLink({ host: frontHost, email }) {
    const uuid = v4();
    TokenStorage.redisClient.set(
      email,
      uuid,
      'EX',
      emailTimes.RESET_LINK_EXPIRE_TIME,
    );
    TokenStorage.redisClient.set(
      `${uuid}-email`,
      email,
      'EX',
      emailTimes.RESET_LINK_EXPIRE_TIME,
    );
    TokenStorage.redisClient.set(
      uuid,
      true,
      'EX',
      emailTimes.AGAIN_GENERATE_LINK_NOT_ALLOWED_TIME,
    );
    return `${frontHost}/${CHANGE_PASSWORD_PATH}/${uuid}`;
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
