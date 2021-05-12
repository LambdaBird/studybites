const app = require('fastify')({ logger: true });

const dbPlugin = require('./plugins/database');

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

    app.all('*', async (_, repl) => {
      return repl.Status(404).Send('route not found');
    });

    app.listen(process.env.PORT, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
