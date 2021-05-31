import fastify from 'fastify';

import objectionModel from './plugins/objectionModel';

import User from './models/User';

import userService from './services/user';

const build = (options = {}) => {
  const app = fastify(options);

  app.register(objectionModel, {
    connection: process.env.DATABASE_URL,
    models: [User],
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
