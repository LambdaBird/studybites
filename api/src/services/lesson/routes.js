import config from '../../../config';

import errorResponse from '../../validation/schemas';
import validatorCompiler from '../../validation/validatorCompiler';
import errorHandler from '../../validation/errorHandler';
import { NotFoundError } from '../../validation/errors';

import {
  patchBodyValidator,
  postBodyValidator,
  validateId,
} from './validators';
import { NOT_FOUND } from './constants';

const router = async (instance) => {
  const { Lesson, UserRole } = instance.models;

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
      const columns = {
        name: 'name',
      };

      if (!req.query.search) {
        columns.name = undefined;
      }

      const data = await Lesson.query()
        .join('users_roles', 'lessons.id', '=', 'users_roles.resource_id')
        .where('users_roles.role_id', config.roles.MAINTAINER.id)
        .join('users', 'users_roles.user_id', '=', 'users.id')
        .select('lessons.*', 'users.first_name', 'users.second_name')
        .skipUndefined()
        .where({
          status: 'Public',
        })
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.LESSON_SEARCH_LIMIT);

      const count = await Lesson.query()
        .skipUndefined()
        .where({
          status: 'Public',
        })
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .count('*');

      return repl.status(200).send({ total: +count[0].count, data });
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

      const data = await Lesson.query()
        .findById(id)
        .join('users_roles', 'lessons.id', '=', 'users_roles.resource_id')
        .where('users_roles.role_id', config.roles.MAINTAINER.id)
        .join('users', 'users_roles.user_id', '=', 'users.id')
        .select('lessons.*', 'users.first_name', 'users.second_name')
        .where({
          status: 'Public',
        });

      if (!data) {
        throw new NotFoundError(NOT_FOUND);
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
    onRequest: instance.auth({ instance }),
    preHandler: instance.access({
      instance,
      role: config.roles.TEACHER.id,
    }),
    handler: async (req, repl) => {
      const columns = {
        name: 'name',
      };

      if (!req.query.search) {
        columns.name = undefined;
      }

      const data = await UserRole.relatedQuery('lessons')
        .skipUndefined()
        .for(
          UserRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER.id,
          }),
        )
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.LESSON_SEARCH_LIMIT);

      const count = await UserRole.relatedQuery('lessons')
        .skipUndefined()
        .for(
          UserRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER.id,
          }),
        )
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .count('*');

      return repl.status(200).send({ total: +count[0].count, data });
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
    onRequest: [instance.auth({ instance })],
    preHandler: instance.access({
      instance,
      type: config.resources.LESSON,
      role: config.roles.MAINTAINER.id,
      getId: (req) => req.params.id,
    }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id);

      const data = await UserRole.relatedQuery('lessons')
        .for(
          UserRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER.id,
          }),
        )
        .where('id', id);

      if (!data) {
        throw new NotFoundError(NOT_FOUND);
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
    onRequest: instance.auth({ instance }),
    preHandler: instance.access({
      instance,
      role: config.roles.TEACHER.id,
    }),
    handler: async (req, repl) => {
      try {
        const data = await Lesson.transaction(async (trx) => {
          const lesson = await Lesson.query(trx)
            .insert(req.body)
            .returning('*');

          await UserRole.query(trx)
            .insert({
              userID: req.user.id,
              roleID: config.roles.MAINTAINER.id,
              resourceType: config.resources.LESSON,
              resourceId: lesson.id,
            })
            .returning('*');

          return lesson;
        });
        return repl.status(200).send({ data });
      } catch (err) {
        throw new Error(err);
      }
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
    onRequest: instance.auth({ instance }),
    preHandler: instance.access({
      instance,
      type: config.resources.LESSON,
      role: config.roles.MAINTAINER.id,
      getId: (req) => req.params.id,
    }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id);

      const data = await UserRole.relatedQuery('lessons')
        .for(
          UserRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER.id,
            resourceId: id,
          }),
        )
        .patch(req.body)
        .returning('*');

      if (!data) {
        throw new NotFoundError(NOT_FOUND);
      }

      return repl.status(200).send({ data });
    },
  });
};

export default router;
