import Queue from 'bull';
import i18next from 'i18next';
import Email from '../email/models/Email';

const emailService = new Email(i18next);

export const sendEmailQueue = new Queue('sendEmail', 'redis://redis:6379');

export const inviteEmail = ({ email, link }) => {
  sendEmailQueue.add('invite', { email, link });
};

sendEmailQueue.process('invite', async (job) => {
  await emailService.sendInvite({ email: job.data.email, link: job.data.link });
});
