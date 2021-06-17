import { v4 } from 'uuid';
import config from '../../../config';

import errorResponse from '../../validation/schemas';
import validatorCompiler from '../../validation/validatorCompiler';
import errorHandler from '../../validation/errorHandler';
import { BadRequestError, NotFoundError } from '../../validation/errors';

import {
  patchBodyValidator,
  postBodyValidator,
  validateId,
} from './validators';
import { NOT_FOUND, INVALID_ENROLL, ENROLL_SUCCESS } from './constants';

const router = async (instance) => {
  const { Lesson, UserRole, Block, LessonBlockStructure } = instance.models;

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

      const { total, results } = await Lesson.getAllPublicLessons({
        ...req.query,
        userId: req.userId,
      }).withGraphFetched('blocks');

      return repl.status(200).send({ total, data: results });
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

      const lesson = await Lesson.query()
        .findById(id)
        .withGraphFetched('authors');

      if (!lesson) {
        throw new NotFoundError(NOT_FOUND);
      }

      return repl.status(200).send({ data: lesson });
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
    handler: async (_, repl) => {
      return repl.status(200).send(Lesson.jsonSchema);
    },
  });

  instance.route({
    method: 'GET',
    url: '/maintain/students',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance }),
    handler: async (req, repl) => {
      const columns = {
        email: 'email',
        firstName: 'first_name',
        lastName: 'last_name',
      };

      if (!req.query.search) {
        columns.email = undefined;
        columns.firstName = undefined;
        columns.lastName = undefined;
      }

      const firstIndex = parseInt(req.query.offset, 10) || 0;
      const lastIndex =
        firstIndex +
        (parseInt(req.query.limit, 10) || config.search.LESSON_SEARCH_LIMIT) -
        1;

      const { total, results } = await UserRole.getAllTeacherStudents({
        columns,
        userId: req.user.id,
        search: req.query.search,
      }).range(firstIndex, lastIndex);

      return repl.status(200).send({
        total,
        data: results,
      });
    },
  });

  instance.route({
    method: 'GET',
    url: '/maintain/',
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

      const data = await UserRole.relatedQuery('lessons')
        .skipUndefined()
        .for(
          UserRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER.id,
          }),
        )
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .where({ status: req.query.status })
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.LESSON_SEARCH_LIMIT)
        .orderBy('updatedAt', 'desc');

      const count = await UserRole.relatedQuery('lessons')
        .skipUndefined()
        .for(
          UserRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.MAINTAINER.id,
          }),
        )
        .where(columns.name, 'ilike', `%${req.query.search}%`)
        .where({ status: req.query.status })
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
    url: '/maintain/',
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

          if (req.body.blocks) {
            const blocksData = await Block.query(trx)
              .insert(
                req.body.blocks.map(
                  ({ id, type, data: blockData, revision }) => ({
                    type,
                    revision,
                    content: {
                      id,
                      type,
                      data: blockData,
                    },
                  }),
                ),
              )
              .returning('blockId');

            const blockStructure = [];

            for (let i = 0, n = blocksData.length; i < n; i += 1) {
              blockStructure.push({
                id: v4(),
                lessonId: lesson.id,
                blockId: blocksData[i].blockId,
              });
            }

            for (let i = 0, n = blockStructure.length; i < n; i += 1) {
              blockStructure[i].parentId = !i ? null : blockStructure[i - 1].id;
              blockStructure[i].childId =
                i === n - 1 ? null : blockStructure[i + 1].id;
            }

            await LessonBlockStructure.query(trx).insert(blockStructure);
          }

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

      const lesson = await Lesson.query()
        .findById(id)
        .where({ status: 'Public' })
        .whereNotExists(
          UserRole.query().select().where({
            userID: req.user.id,
            roleID: config.roles.STUDENT.id,
            resourceType: 'lesson',
            resourceId: id,
          }),
        );

      if (!lesson) {
        throw new BadRequestError(INVALID_ENROLL);
      }

      await UserRole.query()
        .insert({
          userID: req.user.id,
          roleID: config.roles.STUDENT.id,
          resourceType: 'lesson',
          resourceId: lesson.id,
        })
        .returning('*');

      return repl.status(200).send(ENROLL_SUCCESS);
    },
  });

  /*
   * Get all lessons which user are enrolled
   * */
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
        firstName: 'maintainer:userInfo.first_name',
        lastName: 'maintainer:userInfo.last_name',
      };

      if (!req.query.search) {
        columns.name = undefined;
        columns.firstName = undefined;
        columns.lastName = undefined;
      }

      const firstIndex = parseInt(req.query.offset, 10) || 0;
      const lastIndex =
        firstIndex +
        (parseInt(req.query.limit, 10) || config.search.LESSON_SEARCH_LIMIT) -
        1;

      const { total, results } = await Lesson.getAllEnrolled({
        columns,
        userId: req.user.id,
        search: req.query.search,
      }).range(firstIndex, lastIndex);

      return repl.status(200).send({ total, data: results });
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
    onRequest: [instance.auth({ instance })],
    preHandler: instance.access({
      instance,
      role: config.roles.TEACHER.id,
    }),
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

      const data = await UserRole.relatedQuery('users')
        .skipUndefined()
        .for(
          UserRole.query().select('user_id').where({
            roleID: config.roles.STUDENT.id,
            resourceId: id,
          }),
        )
        .select('id', 'email', 'firstName', 'lastName')
        .where(columns.email, 'ilike', `%${req.query.search}%`)
        .orWhere(columns.firstName, 'ilike', `%${req.query.search}%`)
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.USER_SEARCH_LIMIT);

      const count = await UserRole.relatedQuery('users')
        .skipUndefined()
        .for(
          UserRole.query().select('user_id').where({
            roleID: config.roles.STUDENT.id,
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
