import { v4 } from 'uuid';
import { emailTimes } from '../../../config';

const CHANGE_PASSWORD_PATH = 'change-password';

class Redis {
  static redisClient;

  static async invalidateLink({ email, uuid }) {
    this.redisClient.del(email);
    this.redisClient.del(uuid);
    this.redisClient.del(`${uuid}-email`);
  }

  static async generateLink({ host: frontHost, email }) {
    const uuid = v4();
    this.redisClient.set(email, uuid, 'EX', emailTimes.RESET_LINK_EXPIRE_TIME);
    this.redisClient.set(
      `${uuid}-email`,
      email,
      'EX',
      emailTimes.RESET_LINK_EXPIRE_TIME,
    );
    this.redisClient.set(
      uuid,
      true,
      'EX',
      emailTimes.AGAIN_GENERATE_LINK_NOT_ALLOWED_TIME,
    );
    return `${frontHost}/${CHANGE_PASSWORD_PATH}/${uuid}`;
  }

  static async getEmailByUuid({ uuid }) {
    return this.redisClient.get(`${uuid}-email`);
  }

  static async setUserIp({ userIp }) {
    return this.redisClient.set(
      userIp,
      true,
      'EX',
      emailTimes.RESET_PASSWORD_NOT_ALLOWED_TIME,
    );
  }

  static async getResetPasswordAllowedNoAuth({ userIp }) {
    const isUserIpNotExpired = await this.redisClient.get(userIp);
    if (isUserIpNotExpired) {
      const timeout = await this.redisClient.ttl(userIp);
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
    const uuid = await this.redisClient.get(email);
    if (uuid) {
      const isUuidNotExpired = await this.redisClient.get(uuid);
      if (isUuidNotExpired) {
        const timeout = await this.redisClient.ttl(uuid);
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

export default Redis;
