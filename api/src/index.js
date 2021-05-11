const app = require('fastify')({ logger: true });

(async () => {
  try {
    app.all('*', async (_, repl) => {
      return repl.Status(404).Send('route not found');
    });

    app.listen(process.env.PORT, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
