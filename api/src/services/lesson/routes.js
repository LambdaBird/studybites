/* eslint-disable func-names */
import { v4 } from 'uuid';
import objection from 'objection';

import config from '../../../config';

import errorResponse from '../../validation/schemas';
import validatorCompiler from '../../validation/validatorCompiler';
import errorHandler from '../../validation/errorHandler';
import { BadRequestError, NotFoundError } from '../../validation/errors';

import {
  putBodyValidator,
  postBodyValidator,
  validateId,
  learnBodyValidator,
} from './validators';
import {
  NOT_FOUND,
  INVALID_ENROLL,
  ENROLL_SUCCESS,
  ALREADY_FINISHED,
  NOT_STARTED,
  ALREADY_STARTED,
  INVALID_LEARN,
  INVALID_NEXT,
  NOT_FINISHED,
} from './constants';

const router = async (instance) => {
  const { Lesson, UserRole, Block, LessonBlockStructure, User, Result } =
    instance.models;

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
      });

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
    handler: async ({ params }) => {
      const id = validateId(params.id);

      const lesson = await Lesson.query()
        .findById(id)
        .withGraphFetched('authors');

      if (!lesson) {
        throw new NotFoundError(NOT_FOUND);
      }

      return { data: lesson };
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
    preHandler: instance.access({
      instance,
      role: config.roles.TEACHER.id,
    }),
    handler: async ({ user, query }) => {
      const firstIndex = parseInt(query.offset, 10) || 0;
      const lastIndex =
        firstIndex +
        (parseInt(query.limit, 10) || config.search.LESSON_SEARCH_LIMIT) -
        1;

      const { total, results } = await User.query()
        .skipUndefined()
        .select('id', 'email', 'first_name', 'last_name')
        .join('users_roles', 'users.id', '=', 'users_roles.user_id')
        .whereIn(
          'users_roles.resource_id',
          UserRole.query()
            .select('resource_id')
            .where('user_id', user.id)
            .andWhere('role_id', config.roles.MAINTAINER.id),
        )
        .andWhere('users_roles.role_id', config.roles.STUDENT.id)
        .andWhere(
          query.search
            ? function () {
                this.where('email', 'ilike', `%${query.search}%`)
                  .orWhere('first_name', 'ilike', `%${query.search}%`)
                  .orWhere('last_name', 'ilike', `%${query.search}%`);
              }
            : undefined,
        )
        .range(firstIndex, lastIndex);

      return { total, students: results };
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
    handler: async ({ params }) => {
      const id = validateId(params.id);

      const lesson = await Lesson.query()
        .findById(id)
        .withGraphFetched('blocks');

      if (!lesson) {
        throw new NotFoundError(NOT_FOUND);
      }

      try {
        const { parent } = await LessonBlockStructure.query()
          .first()
          .select('id as parent')
          .where({ lessonId: id })
          .whereNull('parentId');

        const { rows: blocksOrder } = await LessonBlockStructure.knex().raw(
          `select lesson_block_structure.block_id from connectby('lesson_block_structure', 'id', 'parent_id', '${parent}', 0, '~') 
          as temporary(id uuid, parent_id uuid, level int, branch text) join lesson_block_structure on temporary.id = lesson_block_structure.id`,
        );

        const blocks = [];

        const dictionary = lesson.blocks.reduce((result, filter) => {
          // eslint-disable-next-line no-param-reassign
          result[filter.blockId] = filter;
          return result;
        }, {});

        blocksOrder.map((block) => blocks.push(dictionary[block.block_id]));

        lesson.blocks = blocks;
      } catch (err) {
        return { lesson };
      }

      return { lesson };
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
    handler: async ({ body, user }) => {
      try {
        const { lesson, blocks } = body;

        const data = await Lesson.transaction(async (trx) => {
          const lessonData = await Lesson.query(trx)
            .insert(lesson)
            .returning('*');

          await UserRole.query(trx)
            .insert({
              userID: user.id,
              roleID: config.roles.MAINTAINER.id,
              resourceType: config.resources.LESSON,
              resourceId: lessonData.id,
            })
            .returning('*');

          if (blocks.length) {
            const blocksData = await Block.query(trx)
              .insert(blocks)
              .returning('*');

            lessonData.blocks = blocksData;

            const blockStructure = [];

            for (let i = 0, n = blocksData.length; i < n; i += 1) {
              blockStructure.push({
                id: v4(),
                lessonId: lessonData.id,
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

          return lessonData;
        });

        return { lesson: data };
      } catch (err) {
        throw new Error(err);
      }
    },
  });

  instance.route({
    method: 'PUT',
    url: '/maintain/:id',
    schema: {
      body: putBodyValidator,
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
    handler: async ({ body, params, user }) => {
      const id = validateId(params.id);

      const { lesson, blocks } = body;

      try {
        const data = await Lesson.transaction(async (trx) => {
          await UserRole.relatedQuery('lessons')
            .for(
              UserRole.query().select().where({
                userID: user.id,
                roleID: config.roles.MAINTAINER.id,
                resourceId: id,
              }),
            )
            .patch(lesson)
            .returning('*');

          const lessonData = await Lesson.query().findById(id);

          if (blocks.length) {
            const revisions = await Block.query(trx)
              .select(
                objection.raw(
                  `json_object_agg(grouped.block_id, grouped.revisions) as values`,
                ),
              )
              .from(
                objection.raw(
                  `(select block_id, array_agg(revision) as revisions from blocks group by block_id) as grouped`,
                ),
              );

            const { values } = revisions[0];

            const blocksToInsert = [];

            for (let i = 0, n = blocks.length; i < n; i += 1) {
              const { revision, blockId } = blocks[i];

              if (revision && !blockId) {
                blocks[i].blockId = v4();
                blocksToInsert.push(blocks[i]);
              }

              if (revision && blockId) {
                if (values[blockId] && !values[blockId].includes(revision)) {
                  blocksToInsert.push(blocks[i]);
                }
              }
            }

            if (blocksToInsert.length) {
              const blocksData = await Block.query(trx)
                .insert(blocksToInsert)
                .returning('*');

              lessonData.blocks = blocksData;
            }

            const blockStructure = [];

            for (let i = 0, n = blocks.length; i < n; i += 1) {
              blockStructure.push({
                id: v4(),
                lessonId: id,
                blockId: blocks[i].blockId,
              });
            }

            for (let i = 0, n = blockStructure.length; i < n; i += 1) {
              blockStructure[i].parentId = !i ? null : blockStructure[i - 1].id;
              blockStructure[i].childId =
                i === n - 1 ? null : blockStructure[i + 1].id;
            }

            await LessonBlockStructure.query(trx)
              .delete()
              .where({ lessonId: id });
            await LessonBlockStructure.query(trx).insert(blockStructure);
          }

          return lessonData;
        });

        return { lesson: data };
      } catch (err) {
        throw new Error(err);
      }
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

  instance.route({
    method: 'POST',
    url: '/:lesson_id/learn',
    schema: {
      body: learnBodyValidator,
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance }),
    preHandler: instance.access({
      instance,
      type: config.resources.LESSON,
      role: config.roles.STUDENT.id,
      getId: (req) => req.params.lesson_id,
    }),
    handler: async ({ params, body, user }) => {
      const id = validateId(params.lesson_id);

      const status = {};

      const { action } = body;

      const checkStatus = await Result.query()
        .where({
          userId: user.id,
          lessonId: id,
        })
        .andWhere(function () {
          this.where({ action: 'start' }).orWhere({ action: 'finish' });
        });

      checkStatus.forEach((entry) => {
        status[entry.action] = true;
      });

      if (status.finish) {
        throw new BadRequestError(ALREADY_FINISHED);
      }

      if (!status.start && action !== 'start') {
        throw new BadRequestError(NOT_STARTED);
      }

      switch (action) {
        case 'start': {
          if (status.start) {
            throw new BadRequestError(ALREADY_STARTED);
          }

          await Result.query().insert({
            lessonId: id,
            userId: user.id,
            action: 'start',
          });

          break;
        }
        case 'finish': {
          const { finished } = await Result.query()
            .first()
            .select(objection.raw('array_agg(block_id) as finished'))
            .where({
              lessonId: id,
              userId: user.id,
            })
            .whereIn('action', config.interactiveBlocks);

          const { blocks } = await LessonBlockStructure.query()
            .first()
            .select(objection.raw('array_agg(blocks.block_id) as blocks'))
            .join(
              'blocks',
              'lesson_block_structure.block_id',
              '=',
              'blocks.block_id',
            )
            .where({ lessonId: id })
            .whereIn('blocks.type', config.interactiveBlocks);

          if (!finished || !blocks.every((block) => finished.includes(block))) {
            throw new BadRequestError(NOT_FINISHED);
          }

          await Result.query().insert({
            lessonId: id,
            userId: user.id,
            action: 'finish',
          });

          break;
        }
        case 'resume': {
          const { blockId, revision } = await Result.query()
            .first()
            .select('results.*')
            .from(function () {
              this.select(this.knex().raw('max(created_at) as created_at'))
                .from('results')
                .where({
                  userId: user.id,
                  lessonId: id,
                })
                .as('test');
            })
            .join('results', 'results.created_at', '=', 'test.created_at');

          await Result.query().insert({
            lessonId: id,
            userId: user.id,
            action: 'resume',
            blockId,
            revision,
          });

          if (blockId) {
            const { parent } = await LessonBlockStructure.query()
              .first()
              .select('id as parent')
              .where({ lessonId: id, blockId });

            status.parent = parent;
          }

          break;
        }
        case 'next': {
          const { blockId, revision } = body;

          if (!blockId || !revision) {
            throw new BadRequestError(INVALID_NEXT);
          }

          const check = await LessonBlockStructure.query().first().where({
            lessonId: id,
            blockId,
          });

          if (!check) {
            throw new BadRequestError(INVALID_LEARN);
          }

          await Result.query().insert({
            lessonId: id,
            userId: user.id,
            action: 'next',
            blockId,
            revision,
          });

          const { parent } = await LessonBlockStructure.query()
            .first()
            .select('id as parent')
            .where({ lessonId: id, blockId });

          status.parent = parent;

          break;
        }
        case 'response': {
          // TODO
          break;
        }
        default:
          throw new BadRequestError(INVALID_LEARN);
      }

      const lesson = await Lesson.query()
        .findById(id)
        .withGraphFetched('blocks');

      if (!lesson) {
        throw new NotFoundError(NOT_FOUND);
      }

      try {
        if (!status.parent) {
          const { parent } = await LessonBlockStructure.query()
            .first()
            .select('id as parent')
            .where({ lessonId: id })
            .whereNull('parentId');

          status.parent = parent;
        }

        const { rows: blocksOrder } = await LessonBlockStructure.knex().raw(
          `select lesson_block_structure.block_id from connectby('lesson_block_structure', 'id', 'parent_id', '${status.parent}', 0, '~') 
          as temporary(id uuid, parent_id uuid, level int, branch text) join lesson_block_structure on temporary.id = lesson_block_structure.id`,
        );

        const blocks = [];

        const dictionary = lesson.blocks.reduce((result, filter) => {
          // eslint-disable-next-line no-param-reassign
          result[filter.blockId] = filter;
          return result;
        }, {});

        if (action === 'start') {
          for (let i = 0, n = blocksOrder.length; i < n; i += 1) {
            delete dictionary[blocksOrder[i].block_id].answer;
            delete dictionary[blocksOrder[i].block_id].weight;

            blocks.push(dictionary[blocksOrder[i].block_id]);

            if (
              config.interactiveBlocks.includes(
                dictionary[blocksOrder[i].block_id].type,
              )
            ) {
              break;
            }
          }
        } else if (action === 'finish') {
          for (let i = 0, n = blocksOrder.length; i < n; i += 1) {
            delete dictionary[blocksOrder[i].block_id].answer;
            delete dictionary[blocksOrder[i].block_id].weight;

            blocks.push(dictionary[blocksOrder[i].block_id]);
          }
        } else {
          for (let i = 0, n = blocksOrder.length; i < n; i += 1) {
            if (
              i === 0 &&
              config.interactiveBlocks.includes(
                dictionary[blocksOrder[i].block_id].type,
              )
            ) {
              // eslint-disable-next-line no-continue
              continue;
            }

            delete dictionary[blocksOrder[i].block_id].answer;
            delete dictionary[blocksOrder[i].block_id].weight;

            blocks.push(dictionary[blocksOrder[i].block_id]);

            if (
              config.interactiveBlocks.includes(
                dictionary[blocksOrder[i].block_id].type,
              )
            ) {
              break;
            }
          }
        }

        lesson.blocks = blocks;
      } catch (err) {
        return { total: 0, lesson, isFinal: false };
      }

      const { count } = await LessonBlockStructure.query()
        .first()
        .count('blockId')
        .where({
          lessonId: id,
        });

      const { blockId: final } = await LessonBlockStructure.query()
        .first()
        .where({
          lessonId: id,
        })
        .whereNull('childId');

      const isFinal = lesson.blocks.some((block) => block.blockId === final);

      return { total: +count, lesson, isFinal };
    },
  });
};

export default router;
