const knex = require('knex');
const cron = require('node-cron');
const Email = require('./email');

class Scheduler {
  constructor() {
    this.mailer = new Email();
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
          link: `http://studybites/invite=${invite.id}`,
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
  const scheduler = new Scheduler();
  await scheduler.start();
})();
