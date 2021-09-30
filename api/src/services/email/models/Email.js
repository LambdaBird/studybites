import nodemailer from 'nodemailer';
import { EMAIL_SETTINGS } from '../../../config';

const { fromName, host } = EMAIL_SETTINGS;

const ONLY_CONSOLE = 1;
const ONLY_EMAIL = 2;
const CONSOLE_AND_EMAIL = 3;

const sendMailStatus = +process.env.SB_SEND_MAIL_STATUS || ONLY_CONSOLE;

class Email {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
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

  sendMail({ ...params }) {
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

  async sendMailWithLogging(params) {
    switch (sendMailStatus) {
      case ONLY_EMAIL:
        await this.sendMail(params);
        break;
      case ONLY_CONSOLE:
        // eslint-disable-next-line no-console
        console.log(Email.getMailMocked(params));
        break;
      case CONSOLE_AND_EMAIL:
        await this.sendMail(params);
        // eslint-disable-next-line no-console
        console.log(Email.getMailMocked(params));
        break;
      default:
        break;
    }
  }

  async sendResetPassword({ email, link }) {
    return this.sendMailWithLogging({
      to: email,
      subject: 'Password reset',
      html: `Reset password link ${link}`,
    });
  }

  async sendPasswordChanged({ email }) {
    return this.sendMailWithLogging({
      to: email,
      subject: 'Password changed',
      html: `Your password were successfully changed`,
    });
  }
}

export default Email;
