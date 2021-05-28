import errorResponse from '../../validation/schemas';
import validatorCompiler from '../../validation/validatorCompiler';
import errorHandler from '../../validation/errorHandler';

import {
  patchBodyValidator,
  postBodyValidator,
  validateId,
} from './validators';
import { NOT_FOUND, INVALID_ENROLL, ENROLL_SUCCESS } from './constants';

import config from '../../../config.json';

const router = async (instance) => {
  instance.route({
    method: 'GET',
    url: '/',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance }),
    handler: async (req, repl) => {
      const data = await instance.objection.models.lesson
        .query()
        .select()
        .where({
          status: 'Public',
        });

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'GET',
    url: '/:id',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id);

      const data = await instance.objection.models.lesson
        .query()
        .findById(id)
        .where({
          status: 'Public',
        });

      if (!data) {
        return repl.status(404).send(NOT_FOUND);
      }

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'OPTIONS',
    url: '/',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance }),
    handler: async (req, repl) => {
      return repl.status(200).send(['Draft', 'Public', 'Private', 'Archived']);
    },
  });

  instance.route({
    method: 'GET',
    url: '/maintain',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isTeacherOnly: true }),
    handler: async (req, repl) => {
      const data = await instance.objection.models.userRole
        .relatedQuery('lessons')
        .for(
          instance.objection.models.userRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER_ROLE,
          }),
        );

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'GET',
    url: '/maintain/:id',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isTeacherOnly: true }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id);

      const data = await instance.objection.models.userRole
        .relatedQuery('lessons')
        .for(
          instance.objection.models.userRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER_ROLE,
          }),
        )
        .where('id', id);

      if (!data) {
        return repl.status(404).send(NOT_FOUND);
      }

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'POST',
    url: '/maintain',
    schema: {
      body: postBodyValidator,
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isTeacherOnly: true }),
    handler: async (req, repl) => {
      const data = await instance.objection.models.lesson
        .query()
        .insert(req.body)
        .returning('*');

      await instance.objection.models.userRole
        .query()
        .insert({
          userID: req.user.id,
          roleID: config.roles.MAINTAINER_ROLE,
          resourceType: 'lesson',
          resourceId: data.id,
        })
        .returning('*');

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'PATCH',
    url: '/maintain/:id',
    schema: {
      body: patchBodyValidator,
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isTeacherOnly: true }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id);

      const data = await instance.objection.models.userRole
        .relatedQuery('lessons')
        .for(
          instance.objection.models.userRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER_ROLE,
            resourceId: id,
          }),
        )
        .patch(req.body)
        .returning('*');

      if (!data) {
        return repl.status(400).send(NOT_FOUND);
      }

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'POST',
    url: '/enroll/:id',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id);

      const lesson = await instance.objection.models.lesson
        .query()
        .findById(id)
        .where({ status: 'Public' })
        .whereNotExists(
          instance.objection.models.userRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.STUDENT_ROLE,
            resourceType: 'lesson',
            resourceId: id,
          }),
        );

      if (!lesson) {
        return repl.status(400).send(INVALID_ENROLL);
      }

      await instance.objection.models.userRole
        .query()
        .insert({
          userID: req.user.id,
          roleID: config.roles.STUDENT_ROLE,
          resourceType: 'lesson',
          resourceId: lesson.id,
        })
        .returning('*');

      return repl.status(200).send(ENROLL_SUCCESS);
    },
  });

  instance.route({
    method: 'GET',
    url: '/enrolled/',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance }),
    handler: async (req, repl) => {
      const columns = {
        name: 'name',
      };

      if (!req.query.search) {
        columns.name = undefined;
      }

      const data = await instance.objection.models.userRole
        .relatedQuery('lessons')
        .skipUndefined()
        .for(
          instance.objection.models.userRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.STUDENT_ROLE,
          }),
        )
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.LESSON_SEARCH_LIMIT);

      const count = await instance.objection.models.userRole
        .relatedQuery('lessons')
        .skipUndefined()
        .for(
          instance.objection.models.userRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.STUDENT_ROLE,
          }),
        )
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.LESSON_SEARCH_LIMIT)
        .count('*');

      return repl.status(200).send({ total: +count[0].count, data });
    },
  });

  instance.route({
    method: 'GET',
    url: '/enrolled/:id',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isTeacherOnly: true }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id);

      const columns = {
        email: 'email',
        firstName: 'firstName',
      };

      if (!req.query.search) {
        columns.email = undefined;
        columns.firstName = undefined;
      }

      const data = await instance.objection.models.userRole
        .relatedQuery('users')
        .skipUndefined()
        .for(
          instance.objection.models.userRole.query().select('user_id').where({
            roleID: config.roles.STUDENT_ROLE,
            resourceId: id,
          }),
        )
        .select('id', 'email', 'firstName', 'secondName')
        .where(columns.email, 'ilike', `%${req.query.search}%`)
        .orWhere(columns.firstName, 'ilike', `%${req.query.search}%`)
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.USER_SEARCH_LIMIT);

      const count = await instance.objection.models.userRole
        .relatedQuery('users')
        .skipUndefined()
        .for(
          instance.objection.models.userRole.query().select('user_id').where({
            roleID: config.roles.STUDENT_ROLE,
            resourceId: id,
          }),
        )
        .where(columns.email, 'ilike', `%${req.query.search}%`)
        .orWhere(columns.firstName, 'ilike', `%${req.query.search}%`)
        .count('*');

      return repl.status(200).send({ total: +count[0].count, data });
    },
  });
};

export default router;
