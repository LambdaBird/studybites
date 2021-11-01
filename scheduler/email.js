import mailer from 'nodemailer';
import { DEFAULT_LANGUAGE } from './scheduler.js';

export class Email {
  constructor({ i18n }) {
    this.t = i18n.t.bind(i18n);
    this.transporter = mailer.createTransport({
      pool: true,
      host: 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: true,
      auth: {
        user: process.env.SB_MAIL_USER,
        pass: process.env.SB_MAIL_PASSWORD,
      },
    });
  }

  static getMailMocked({ ...params }) {
    return {
      from: 'StudyBites',
      ...params,
    };
  }

  async sendMailWithLogging(params) {
    console.log(Email.getMailMocked(params));
  }

  async sendInvite({ email, link, language = DEFAULT_LANGUAGE }) {
    return this.sendMailWithLogging({
      to: email,
      subject: this.t('email:invite.subject', { lng: language }),
      html: this.t('email:invite.html', { lng: language, link }),
    });
  }
}
