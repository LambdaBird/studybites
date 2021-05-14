import fastify from 'fastify';
import objection from 'fastify-objectionjs';
import jwt from 'fastify-jwt';

import User from './models/User';

import userService from './services/user';

const app = fastify({ logger: true });

(async () => {
  try {
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

    app.register(jwt, { secret: process.env.JWT_SECRET });

    app.register((instance) => userService(instance), {
      prefix: '/api/v1/user',
    });

    app.all('*', async (_, repl) => {
      return repl.status(404).send({ message: 'route not found' });
    });

    app.listen(process.env.PORT, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();

export default app;
