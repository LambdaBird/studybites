import fastify from 'fastify';
import fastifyObjection from 'fastify-objection';
import qs from 'qs';

import models from './models';

import userService from './services/user';
import lessonsService from './services/lessons';
import learnService from './services/learn';
import lessonsManagementService from './services/lessons-management';
import coursesManagementService from './services/courses-management';
import coursesService from './services/courses';
import keywordsService from './services/keywords';

import errorsAndValidation from './validation';

export default (options = {}) => {
  const app = fastify({
    ...options,
    querystringParser: (str) => qs.parse(str),
    ajv: {
      customOptions: {
        coerceTypes: 'array',
      },
    },
  });

  app.register(errorsAndValidation);

  app.register(fastifyObjection, {
    connection: process.env.DATABASE_URL,
    models,
  });

  app.register(userService, {
    prefix: '/api/v1/user',
  });

  app.register(lessonsService, {
    prefix: '/api/v1/lessons',
  });

  app.register(learnService, {
    prefix: '/api/v1/learn',
  });

  app.register(lessonsManagementService, {
    prefix: '/api/v1/lessons-management',
  });

  app.register(coursesManagementService, {
    prefix: '/api/v1/courses-management',
  });

  app.register(coursesService, {
    prefix: '/api/v1/courses',
  });

  app.register(keywordsService, {
    prefix: '/api/v1/keywords',
  });

  return app;
};
