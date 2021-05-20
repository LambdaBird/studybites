import fastify from 'fastify';
import objection from 'fastify-objectionjs';

import User from './models/User';

import userService from './services/user';

const build = (options = {}) => {
  const app = fastify(options);

  app.register(objection, {
    knexConfig: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
    },
    models: [User],
  });

  app.after(async () => {
    try {
      await app.objection.knex.migrate.latest();
      app.log.info('successfully automigrated');
    } catch (err) {
      app.log.error(err);
    }
  });

  app.register((instance, _, next) => userService(instance, next), {
    prefix: '/api/v1/user',
  });

  app.all('*', async (_, repl) => {
    return repl.status(404).send({ message: 'route not found' });
  });

  return app;
};

export default build;
