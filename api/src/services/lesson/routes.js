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
      const columns = {
        name: 'name',
      };

      if (!req.query.search) {
        columns.name = undefined;
      }

      const data = await instance.objection.models.lesson
        .query()
        .select()
        .skipUndefined()
        .where({
          status: 'Public',
        })
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.LESSON_SEARCH_LIMIT);

      const count = await instance.objection.models.lesson
        .query()
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
    onRequest: [
      instance.auth({ instance }),
      instance.access({
        instance,
        role: config.roles.MAINTAINER_ROLE,
      }),
    ],
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
            roleID: config.roles.MAINTAINER_ROLE,
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
            roleID: config.roles.MAINTAINER_ROLE,
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
    onRequest: [
      instance.auth({ instance }),
      instance.access({
        instance,
        role: config.roles.MAINTAINER_ROLE,
      }),
    ],
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
    onRequest: [
      instance.auth({ instance }),
      instance.access({
        instance,
        role: config.roles.MAINTAINER_ROLE,
      }),
    ],
    handler: async (req, repl) => {
      try {
        const data = await instance.objection.models.lesson.transaction(
          async (trx) => {
            const lesson = await instance.objection.models.lesson
              .query(trx)
              .insert(req.body)
              .returning('*');

            await instance.objection.models.userRole
              .query(trx)
              .insert({
                userID: req.user.id,
                roleID: config.roles.MAINTAINER_ROLE,
                resourceType: 'lesson',
                resourceId: lesson.id,
              })
              .returning('*');

            return lesson;
          },
        );
        return repl.status(200).send({ data });
      } catch (err) {
        return err;
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
    onRequest: [
      instance.auth({ instance }),
      instance.access({
        instance,
        role: config.roles.MAINTAINER_ROLE,
      }),
    ],
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
};

export default router;
