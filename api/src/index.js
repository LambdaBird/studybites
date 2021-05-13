const app = require('fastify')({ logger: true });

const dbPlugin = require('./plugins/database');

const userService = require('./services/user');

(async () => {
  try {
    app.register(dbPlugin, {
      client: 'pg',
      connection: process.env.DATABASE_URL,
    });

    app.after(async () => {
      try {
        await app.db.migrate.latest();
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
