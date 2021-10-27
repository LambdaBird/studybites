const mailer = require('nodemailer');

class Email {
  constructor() {
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

  async sendInvite({ email, link }) {
    return this.sendMailWithLogging({
      to: email,
      subject: 'You have been invited to StudyBites',
      html: `Invite link: ${link}`,
    });
  }
}

module.exports = Email;
