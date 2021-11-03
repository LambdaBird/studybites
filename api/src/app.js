import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyObjection from 'fastify-objection';
import qs from 'qs';

import User from './models/User';
import Role from './models/Role';
import UserRole from './models/UserRole';
import Lesson from './models/Lesson';
import Block from './models/Block';
import LessonBlockStructure from './models/LessonBlockStructure';
import Result from './models/Result';
import Course from './models/Course';
import CourseLessonStructure from './models/CourseLessonStructure';
import Keyword from './models/Keyword';
import ResourceKeyword from './models/ResourceKeyword';
import File from './models/File';
import ResourceFile from './models/ResourceFile';

import userService from './services/user';
import lessonsService from './services/lessons';
import learnService from './services/learn';
import lessonsManagementService from './services/lessons-management';
import coursesManagementService from './services/courses-management';
import coursesService from './services/courses';
import keywordsService from './services/keywords';

import errorsAndValidation from './validation';
import i18n from './i18n';

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

  app.register(fastifyCors);

  app.register(errorsAndValidation);

  app.register(i18n);

  app.register(fastifyObjection, {
    connection: process.env.DATABASE_URL,
    models: [
      User,
      Role,
      UserRole,
      Lesson,
      Block,
      LessonBlockStructure,
      Result,
      Course,
      CourseLessonStructure,
      Keyword,
      ResourceKeyword,
      File,
      ResourceFile,
    ],
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
