import nodemailer from 'nodemailer';
import {
  EMAIL_SETTINGS,
  SEND_MAIL_STATUS,
  SEND_MAIL_STATUSES,
} from '../../../config';

const { fromName, host } = EMAIL_SETTINGS;
const { CONSOLE_AND_EMAIL, ONLY_CONSOLE, ONLY_EMAIL } = SEND_MAIL_STATUSES;

class Email {
  static transporter;

  constructor() {
    Email.transporter = nodemailer.createTransport({
      pool: true,
      host,
      port: process.env.SMTP_PORT || 465,
      secure: true,
      auth: {
        user: process.env.SB_MAIL_USER,
        pass: process.env.SB_MAIL_PASSWORD,
      },
    });
  }

  static sendMail({ ...params }) {
    return this.transporter.sendMail({
      from: `"${fromName}" <${process.env.SB_MAIL_USER}>`,
      ...params,
    });
  }

  static getMailMocked({ ...params }) {
    return {
      from: `"${fromName}" <${process.env.SB_MAIL_USER}>`,
      ...params,
    };
  }

  static async sendMailWithLogging(params) {
    if (SEND_MAIL_STATUS === ONLY_EMAIL) {
      await this.sendMail(params);
    } else if (SEND_MAIL_STATUS === ONLY_CONSOLE) {
      const message = this.getMailMocked(params);
      // eslint-disable-next-line no-console
      console.log(message);
    } else if (SEND_MAIL_STATUS === CONSOLE_AND_EMAIL) {
      await this.sendMail(params);
      const message = this.getMailMocked(params);
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }

  static async sendResetPassword({ email, link }) {
    return this.sendMailWithLogging({
      to: email,
      subject: 'Password reset',
      html: `Reset password link ${link}`,
    });
  }

  static async sendPasswordChanged({ email }) {
    return this.sendMailWithLogging({
      to: email,
      subject: 'Password changed',
      html: `Your password were successfully changed`,
    });
  }
}

export default Email;
