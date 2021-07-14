import fp from 'fastify-plugin';
import knex from 'knex';
import objection from 'objection';

import { ERROR_MISSING_FIELDS, ERROR_INVALID_ARRAY } from './errors';

export default fp((instance, options, next) => {
  if (!options.connection || !options.models) {
    return next(new Error(ERROR_MISSING_FIELDS));
  }

  if (!Array.isArray(options.models) || !options.models.length) {
    return next(new Error(ERROR_INVALID_ARRAY));
  }

  const connection = knex({
    client: 'pg',
    connection: options.connection,
    ...objection.knexSnakeCaseMappers(),
  });

  const models = {};

  objection.Model.knex(connection);

  options.models.forEach((model) => {
    models[model.name] = model;
  });

  instance.decorate('models', models);
  instance.decorate('knex', connection);

  instance.addHook('onClose', (_, done) => {
    connection.destroy();
    return done();
  });

  return next();
});
