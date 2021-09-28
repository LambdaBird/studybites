import nodemailer from 'nodemailer';
import { v4 } from 'uuid';

import {
  DEBUG_EMAIL,
  emailTimes,
  DEBUG_MAIL_STATUS,
  EMAIL_SETTINGS,
} from '../../config';

const { CONSOLE_AND_EMAIL, ONLY_CONSOLE, ONLY_EMAIL } = DEBUG_MAIL_STATUS;
const { fromName, host } = EMAIL_SETTINGS;

export const getEmailUtils = (redisClient) => {
  const transporter = nodemailer.createTransport({
    pool: true,
    host,
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SB_MAIL_USER,
      pass: process.env.SB_MAIL_PASSWORD,
    },
  });

  const sendMail = ({ ...params }) => {
    return transporter.sendMail({
      from: `"${fromName}" <${process.env.SB_MAIL_USER}>`,
      ...params,
    });
  };

  const getMailMocked = ({ ...params }) => {
    return {
      from: `"${fromName}" <${process.env.SB_MAIL_USER}>`,
      ...params,
    };
  };

  const sendMailDebug = async (params) => {
    if (DEBUG_EMAIL === ONLY_EMAIL) {
      await sendMail(params);
    } else if (DEBUG_EMAIL === ONLY_CONSOLE) {
      const message = getMailMocked(params);
      // eslint-disable-next-line no-console
      console.log(message);
    } else if (DEBUG_EMAIL === CONSOLE_AND_EMAIL) {
      await sendMail(params);
      const message = getMailMocked(params);
      // eslint-disable-next-line no-console
      console.log(message);
    }
  };

  const sendResetPassword = async ({ email, link }) => {
    return sendMailDebug({
      to: email,
      subject: 'Password reset',
      html: `Reset password link ${link}`,
    });
  };

  const sendPasswordChanged = async ({ email }) => {
    return sendMailDebug({
      to: email,
      subject: 'Password changed',
      html: `Your password were successfully changed`,
    });
  };

  const verifyPasswordReset = async ({ email, uuid: id }) => {
    const uuid = await redisClient.get(email);
    return uuid === id;
  };

  const invalidateLink = async ({ email, uuid }) => {
    redisClient.del(email);
    redisClient.del(uuid);
    redisClient.del(`${uuid}-email`);
  };

  const generateLink = async ({ host: frontHost, email }) => {
    const uuid = v4();
    redisClient.set(email, uuid, 'EX', emailTimes.RESET_LINK_EXPIRE_TIME);
    redisClient.set(
      `${uuid}-email`,
      email,
      'EX',
      emailTimes.RESET_LINK_EXPIRE_TIME,
    );
    redisClient.set(
      uuid,
      true,
      'EX',
      emailTimes.AGAIN_GENERATE_LINK_NOT_ALLOWED_TIME,
    );
    return `http://${frontHost}/change-password/${uuid}`;
  };

  const getEmailByUuid = async ({ uuid }) => {
    return redisClient.get(`${uuid}-email`);
  };

  const setUserIp = async ({ userIp }) => {
    return redisClient.set(
      userIp,
      true,
      'EX',
      emailTimes.RESET_PASSWORD_NOT_ALLOWED_TIME,
    );
  };

  const getResetPasswordAllowedNoAuth = async ({ userIp }) => {
    const isUserIpNotExpired = await redisClient.get(userIp);
    if (isUserIpNotExpired) {
      const timeout = await redisClient.ttl(userIp);
      return {
        allowed: false,
        timeout,
      };
    }
    return {
      allowed: true,
    };
  };

  const getResetPasswordAllowed = async ({ email }) => {
    const uuid = await redisClient.get(email);
    if (uuid) {
      const isUuidNotExpired = await redisClient.get(uuid);
      if (isUuidNotExpired) {
        const timeout = await redisClient.ttl(uuid);
        return {
          allowed: false,
          timeout,
        };
      }
    }
    return {
      allowed: true,
    };
  };

  return {
    getEmailByUuid,
    setUserIp,
    getResetPasswordAllowed,
    getResetPasswordAllowedNoAuth,
    sendResetPassword,
    sendPasswordChanged,
    generateLink,
    invalidateLink,
    verifyPasswordReset,
  };
};
