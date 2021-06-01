import fp from 'fastify-plugin';
import knex from 'knex';
import objection from 'objection';

import { ERROR_MISSING_FIELDS, ERROR_INVALID_ARRAY } from './errors';

const objectionModel = (instance, options, next) => {
  if (!options.connection || !options.models) {
    next(new Error(ERROR_MISSING_FIELDS));
    return;
  }

  if (!Array.isArray(options.models) || options.models.length < 1) {
    next(new Error(ERROR_INVALID_ARRAY));
    return;
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
    done();
  });

  next();
};

export default fp(objectionModel);
