import knex from 'knex';
import cron from 'node-cron';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { Email } from './email.js';

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGES_LIST = ['en', 'ru'];

class Scheduler {
  constructor({ i18n }) {
    this.mailer = new Email({ i18n });
  }

  async start() {
    try {
      await this.connDB();
      // invite job will run every one minute
      cron.schedule('* * * * *', this.inviteJob, {});
      console.log('scheduler started successfully');
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  async connDB() {
    this.db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
    });
    await this.db.raw('SELECT 1');
  }

  inviteJob = async () => {
    try {
      const pendingInvites = await this.db('invites').where({
        status: 'pending',
        email_status: 'pending',
      });
      pendingInvites.map(async (invite) => {
        await this.mailer.sendInvite({
          email: invite.email,
          link: `${process.env.HOST}/invite/${invite.id}`,
        });
        await this.db('invites').where({ id: invite.id }).update({
          email_status: 'success',
        });
      });
    } catch (e) {
      console.log('invite job failed:', e);
    }
  };
}

(async () => {
  await i18next.use(Backend).init({
    initImmediate: false,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    preload: LANGUAGES_LIST,
    ns: ['email'],
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `locales/{{lng}}/{{ns}}.json`,
    },
  });
  const scheduler = new Scheduler({
    i18n: i18next,
  });
  await scheduler.start();
})();
