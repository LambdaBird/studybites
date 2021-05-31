import fastify from 'fastify';
import objection from 'fastify-objectionjs';

import User from './models/User';
import Role from './models/Role';
import UserRole from './models/UserRole';
import Lesson from './models/Lesson';

import userService from './services/user';
import lessonService from './services/lesson';

const build = (options = {}) => {
  const app = fastify(options);

  app.register(objection, {
    knexConfig: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
    },
    models: [User, Role, UserRole, Lesson],
  });

  app.register(userService, {
    prefix: '/api/v1/user',
  });

  app.register(lessonService, {
    prefix: '/api/v1/lesson',
  });

  app.all('*', async (_, repl) => {
    return repl.status(404).send({
      fallback: 'errors.not_found',
      errors: [
        {
          key: 'resource.not_found',
          message: 'Requested resource not found',
        },
      ],
    });
  });

  return app;
};

export default build;
