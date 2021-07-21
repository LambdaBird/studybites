import fastify from 'fastify';

import fastifyObjection from './plugins/fastifyObjection';

import User from './models/User';
import Role from './models/Role';
import UserRole from './models/UserRole';
import Lesson from './models/Lesson';
import Block from './models/Block';
import LessonBlockStructure from './models/LessonBlockStructure';
import Result from './models/Result';

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

export default (options = {}) => {
  const app = fastify(options);

  app.register(fastifyObjection, {
    connection: process.env.DATABASE_URL,
    models: [User, Role, UserRole, Lesson, Block, LessonBlockStructure, Result],
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
