/* eslint-disable no-console */
import knex from 'knex';
import * as Minio from 'minio';
import { hashPassword } from './utils/salt';

const s3Policy = {
  Statement: [
    {
      Action: ['s3:GetBucketLocation'],
      Effect: 'Allow',
      Principal: {
        AWS: ['*'],
      },
      Resource: [`arn:aws:s3:::${process.env.S3_BUCKET}`],
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: {
        AWS: ['*'],
      },
      Resource: [`arn:aws:s3:::${process.env.S3_BUCKET}/*`],
    },
  ],
  Version: '2012-10-17',
};

const minio = new Minio.Client({
  endPoint: process.env.S3_HOST,
  port: +process.env.S3_PORT,
  useSSL: false,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
});

(async () => {
  try {
    const buckets = await minio.listBuckets();
    if (!buckets.length) {
      await minio.makeBucket(process.env.S3_BUCKET);
    }
    await minio.setBucketPolicy(
      process.env.S3_BUCKET,
      JSON.stringify(s3Policy),
    );

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

    const args = process.argv.slice(2, process.argv.length);

    if (!args[0] || !args[1]) {
      console.log('provide an email and a password for super admin');
      process.exit(1);
    }

    const email = args[0];
    const password = args[1];

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
