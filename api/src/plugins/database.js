const fp = require('fastify-plugin');
const knex = require('knex');

module.exports = fp((instance, options, next) => {
  const database = knex(options);
  instance.decorate('db', database);
  next();
});
