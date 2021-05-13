const app = require('fastify')({ logger: true });
const objection = require('fastify-objectionjs');

const User = require('./models/User');

const userService = require('./services/user');

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
