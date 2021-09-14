import chooseDB from './utils/chooseDB';

const config = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: chooseDB(),
      charset: 'utf8',
    },
    migrations: {
      directory: './migrations',
    },
  },
};

export default config;
