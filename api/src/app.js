import fastify from 'fastify';

import objectionModel from './plugins/objectionModel';

import User from './models/User';
import Role from './models/Role';
import UserRole from './models/UserRole';
import Lesson from './models/Lesson';

import userService from './services/user';
import lessonService from './services/lesson';

export const RESOURCE_NOT_FOUND = {
  fallback: 'errors.not_found',
  errors: [
    {
      key: 'route.errors.not_found',
      message: 'Requested resource not found',
    },
  ],
};

const build = (options = {}) => {
  const app = fastify(options);

  app.register(objectionModel, {
    connection: process.env.DATABASE_URL,
    models: [User, Role, UserRole, Lesson],
  });

  app.register(userService, {
    prefix: '/api/v1/user',
  });

  app.register(lessonService, {
    prefix: '/api/v1/lesson',
  });

  app.all('*', async (_, repl) => {
    return repl.status(404).send(RESOURCE_NOT_FOUND);
  });

  return app;
};

export default build;
