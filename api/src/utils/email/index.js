import nodemailer from 'nodemailer';
import { v4 } from 'uuid';

import { redisClient, redisGetAsync } from '../../redisClient';
import {
  CONSOLE_AND_EMAIL,
  DEBUG_EMAIL,
  ONLY_CONSOLE,
  ONLY_EMAIL,
} from '../../config';

const RESET_LINK_EXPIRE_TIME = 60 * 5; // 5 minutes
const AGAIN_GENERATE_LINK_NOT_ALLOWED = 5; // 10 seconds

const fromName = 'StudyBites';
const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
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

const sendMailMocked = ({ ...params }) => {
  return {
    from: `"${fromName}" <${process.env.SB_MAIL_USER}>`,
    ...params,
  };
};

// eslint-disable-next-line consistent-return
const sendResetPassword = async ({ email, link }) => {
  const params = {
    to: email,
    subject: 'Password reset',
    html: `Reset password link ${link}`,
  };
  if (DEBUG_EMAIL === ONLY_EMAIL) {
    await sendMail(params);
  } else if (DEBUG_EMAIL === ONLY_CONSOLE) {
    return sendMailMocked(params);
  } else if (DEBUG_EMAIL === CONSOLE_AND_EMAIL) {
    await sendMail(params);
    return sendMailMocked(params);
  }
};

// eslint-disable-next-line consistent-return
const sendPasswordChanged = async ({ email }) => {
  const params = {
    to: email,
    subject: 'Password changed',
    html: `Your password were successfully changed`,
  };
  if (DEBUG_EMAIL === ONLY_EMAIL) {
    await sendMail(params);
  } else if (DEBUG_EMAIL === ONLY_CONSOLE) {
    return sendMailMocked(params);
  } else if (DEBUG_EMAIL === CONSOLE_AND_EMAIL) {
    await sendMail(params);
    return sendMailMocked(params);
  }
};

const verifyPasswordReset = async ({ email, uuid: id }) => {
  const { uuid } = JSON.parse((await redisGetAsync(email)) || '{}');
  return uuid === id;
};

const invalidateLink = async ({ email, uuid }) => {
  redisClient.del(email);
  redisClient.del(uuid);
};

const generateLink = async ({ host, email }) => {
  const uuid = v4();
  redisClient.set(
    email,
    JSON.stringify({
      uuid,
    }),
    'EX',
    RESET_LINK_EXPIRE_TIME,
  );
  redisClient.set(uuid, true, 'EX', AGAIN_GENERATE_LINK_NOT_ALLOWED);
  return `http://${host}/change-password/${uuid}`;
};

export const emailUtils = {
  sendMail,
  sendMailMocked,
  sendResetPassword,
  sendPasswordChanged,
  generateLink,
  invalidateLink,
  verifyPasswordReset,
};
