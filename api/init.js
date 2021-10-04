/* eslint-disable no-console */
import knex from 'knex';
import { hashPassword } from './utils/salt';

(async () => {
  try {
    const db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
    });

    await db.migrate.latest();
    console.log('successfully migrated');

    const admin = await db
      .select('id')
      .from('users')
      .where('is_super_admin', true);

    if (admin.length) {
      console.log('super admin already exits');
      console.log('skipping initialization');
      process.exit(0);
    }

    const email = process.env.SB_ADMIN_EMAIL;
    const password = process.env.SB_ADMIN_PASSWORD;

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email,
      )
    ) {
      console.log('provide a valid email');
      process.exit(1);
    }

    if (!/^(?=.*\d)(?=.*\D).{5,}$/.test(password)) {
      console.log(
        'password must be longer than 5 characters and contain at least one number and one letter',
      );
      process.exit(1);
    }

    const hash = await hashPassword(password);

    if (!hash) {
      console.log('Something went wrong');
      process.exit(1);
    }

    const result = await db('users').insert({
      email,
      password: hash,
      first_name: 'Super',
      last_name: 'Admin',
      is_super_admin: true,
      is_confirmed: true,
    });

    if (result.rowCount) {
      console.log('successfully added super admin');
      process.exit(0);
    } else {
      console.log('something went wrong');
      process.exit(1);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
