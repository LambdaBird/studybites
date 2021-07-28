import objection from 'objection';
import path from 'path';

import { INVALID_ENROLL, NOT_FOUND } from '../services/lesson/constants';
import { BadRequestError, NotFoundError } from '../validation/errors';

import config from '../../config';

import BaseModel from './BaseModel';

class Lesson extends BaseModel {
  static get tableName() {
    return 'lessons';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        status: {
          type: 'string',
          enum: ['Draft', 'Public', 'Private', 'Archived'],
          default: 'Draft',
        },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static relationMappings() {
    return {
      students: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'lessons.id',
          through: {
            modelClass: path.join(__dirname, 'UserRole'),
            from: 'users_roles.resource_id',
            to: 'users_roles.user_id',
          },
          to: 'users.id',
        },
        modify: (query) => {
          return query
            .where({
              resource_type: 'lesson',
              role_id: config.roles.STUDENT.id,
            })
            .select('id', 'first_name', 'last_name');
        },
      },

      maintainer: {
        relation: objection.Model.HasOneRelation,
        modelClass: path.join(__dirname, 'UserRole'),
        join: {
          from: 'lessons.id',
          to: 'users_roles.resource_id',
        },
      },

      author: {
        relation: objection.Model.HasOneThroughRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'lessons.id',
          through: {
            modelClass: path.join(__dirname, 'UserRole'),
            from: 'users_roles.resource_id',
            to: 'users_roles.user_id',
            extra: 'resource_type',
          },
          to: 'users.id',
        },
        modify: (query) => {
          return query
            .select('id', 'first_name', 'last_name')
            .where({ role_id: config.roles.MAINTAINER.id });
        },
      },

      blocksRevisions: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Block'),
        join: {
          from: 'lessons.id',
          through: {
            modelClass: path.join(__dirname, 'LessonBlockStructure'),
            from: 'lesson_block_structure.lesson_id',
            to: 'lesson_block_structure.block_id',
          },
          to: 'blocks.block_id',
        },
      },

      blocks: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Block'),
        join: {
          from: 'lessons.id',
          through: {
            modelClass: path.join(__dirname, 'LessonBlockStructure'),
            from: 'lesson_block_structure.lesson_id',
            to: 'lesson_block_structure.block_id',
          },
          to: 'blocks.block_id',
        },
        modify: (query) => {
          return query
            .select('b.*')
            .from(
              objection.raw(
                `(select block_id, MAX(created_at) as created_at from blocks group by block_id) as blocks`,
              ),
            )
            .join(
              objection.raw(
                `blocks as b on b.block_id = blocks.block_id and b.created_at = blocks.created_at`,
              ),
            );
        },
      },

      lessonBlocks: {
        relation: objection.Model.HasOneRelation,
        modelClass: path.join(__dirname, 'LessonBlockStructure'),
        join: {
          from: 'lessons.id',
          to: 'lesson_block_structure.lesson_id',
        },
        modify: (query) => {
          return query.select('blocks');
        },
      },
    };
  }

  static findById({ lessonId }) {
    return this.query()
      .findById(lessonId)
      .throwIfNotFound({ error: new NotFoundError(NOT_FOUND) });
  }

  static checkIfEnrolled({ lessonId, userId }) {
    return this.query()
      .findById(lessonId)
      .where({ status: 'Public' })
      .whereNotIn(
        'id',
        this.knex().raw(`
          select resource_id from users_roles 
          where user_id = ${userId} and role_id = ${config.roles.STUDENT.id}
        `),
      )
      .throwIfNotFound({ error: new BadRequestError(INVALID_ENROLL) });
  }

  /**
   * get all lessons where status = 'Public' with author,
   * search, pagination and total
   */
  static getAllPublicLessons({ userId, offset, limit, search }) {
    const start = offset;
    const end = start + limit - 1;

    return (
      this.query()
        .select(
          'lessons.*',
          /**
           * using cast to set is_enrolled field to true if user is enrolled to this lesson
           */
          this.knex().raw(`
            (select cast(case when count(*) > 0 then true else false end as bool)
              from users_roles
              where role_id = ${config.roles.STUDENT.id}
                and user_id = ${userId}
                and resource_type = '${config.resources.LESSON}'
                and resource_id = lessons.id) is_enrolled,
            json_build_object('id', author.id, 'firstName', author."firstName", 'lastName', author."lastName") author
        `),
        )
        .from(
          this.knex().raw(`
            (select id, first_name as "firstName", last_name as "lastName" from users) author
        `),
        )
        .join('users_roles', 'users_roles.user_id', '=', 'author.id')
        .join('lessons', 'lessons.id', '=', 'users_roles.resource_id')
        .where('users_roles.role_id', config.roles.MAINTAINER.id)
        .andWhere('users_roles.resource_type', config.resources.LESSON)
        .andWhere('lessons.status', 'Public')
        /**
         * using concat to concatenate fields to search through
         */
        .andWhere(
          this.knex().raw(
            `concat(author."firstName", ' ', author."lastName", ' ', author."firstName", ' ', lessons.name)`,
          ),
          'ilike',
          `%${search ? search.replace(/ /g, '%') : '%'}%`,
        )
        .range(start, end)
    );
  }

  static createLesson({ trx, lesson }) {
    return this.query(trx).insert(lesson).returning('*');
  }

  static getLessonWithAuthor({ lessonId }) {
    return this.query().findById(lessonId).withGraphFetched('author');
  }

  static getLessonWithProgress({ lessonId }) {
    return this.query()
      .select(
        'lessons.*',
        this.knex().raw(`
          (select count(*) from results where lesson_id = lessons.id and action in ('next', 'response')) interactive_passed
        `),
        this.knex().raw(`
          (select count(*) from lesson_block_structure join blocks on blocks.block_id = lesson_block_structure.block_id
          where blocks.type in ('next', 'quiz') and lesson_block_structure.lesson_id = lessons.id) interactive_total
        `),
      )
      .findById(lessonId)
      .withGraphFetched('author');
  }

  static getAllFinishedLessons({ userId, offset: start, limit, search }) {
    const end = start + limit - 1;

    return this.query()
      .select(
        'lessons.*',
        this.knex().raw(`true is_finished`),
        this.knex().raw(`
          json_build_object('id', author.id, 'firstName', author."firstName", 'lastName', author."lastName") author
        `),
        this.knex().raw(`
          (select count(*) from results where lesson_id = lessons.id and action in ('next', 'response')) interactive_passed
        `),
        this.knex().raw(`
          (select count(*) from lesson_block_structure join blocks on blocks.block_id = lesson_block_structure.block_id
          where blocks.type in ('next', 'quiz') and lesson_block_structure.lesson_id = lessons.id) interactive_total
        `),
      )
      .from(
        this.knex().raw(`
        (select id, first_name as "firstName", last_name as "lastName" from users) author
        `),
      )
      .join('users_roles', 'users_roles.user_id', '=', 'author.id')
      .join('lessons', 'lessons.id', '=', 'users_roles.resource_id')
      .join(
        this.knex().raw('users_roles learn'),
        'learn.resource_id',
        '=',
        'lessons.id',
      )
      .join('results', 'results.lesson_id', '=', 'lessons.id')
      .where('users_roles.role_id', config.roles.MAINTAINER.id)
      .andWhere('learn.role_id', config.roles.STUDENT.id)
      .andWhere('learn.user_id', userId)
      .andWhere('users_roles.resource_type', config.resources.LESSON)
      .andWhere('results.action', 'finish')
      .andWhere('results.user_id', userId)
      .andWhere(
        this.knex().raw(
          `concat(author."firstName", ' ', author."lastName", ' ', author."firstName", ' ', lessons.name)`,
        ),
        'ilike',
        `%${search ? search.replace(/ /g, '%') : '%'}%`,
      )
      .range(start, end);
  }

  /**
   * get all students enrolled to teacher`s lessons
   * with search, pagination and total
   */
  static getAllEnrolledStudents({
    userId,
    lessonId = undefined,
    offset: start,
    limit,
    search,
  }) {
    const end = start + limit - 1;

    return (
      this.query()
        .skipUndefined()
        .select(
          'users.id',
          'users.email',
          'users.first_name',
          'users.last_name',
        )
        .join('users_roles', 'users_roles.resource_id', '=', 'lessons.id')
        .join(
          this.knex().raw(`users_roles students`),
          'students.resource_id',
          '=',
          'lessons.id',
        )
        .join('users', 'users.id', '=', 'students.user_id')
        .where('users_roles.role_id', config.roles.MAINTAINER.id)
        .andWhere('lessons.id', lessonId)
        .andWhere('users_roles.user_id', userId)
        .andWhere('students.role_id', config.roles.STUDENT.id)
        /**
         * using concat to concatenate fields to search through
         */
        .andWhere(
          this.knex().raw(
            `concat(users.email, ' ', users.first_name, ' ', users.last_name, ' ', users.first_name)`,
          ),
          'ilike',
          `%${search ? search.replace(/ /g, '%') : '%'}%`,
        )
        .groupBy('users.id')
        .range(start, end)
    );
  }

  static updateLesson({ trx, lessonId, lesson }) {
    return this.query(trx).findById(lessonId).patch(lesson).returning('*');
  }

  /**
   * get all lessons that teacher is maintaining
   * with search, pagination and total
   */
  static getAllMaintainableLessons({ userId, offset: start, limit, search }) {
    const end = start + limit - 1;

    return this.query()
      .join('users_roles', 'users_roles.resource_id', '=', 'lessons.id')
      .where('users_roles.role_id', config.roles.MAINTAINER.id)
      .andWhere('users_roles.user_id', userId)
      .andWhere(
        'lessons.name',
        'ilike',
        `%${search ? search.replace(/ /g, '%') : '%'}%`,
      )
      .orderBy('lessons.created_at', 'desc')
      .withGraphFetched('students')
      .range(start, end);
  }

  /**
   * get all lessons user had enrolled to
   */
  static getOngoingLessons({
    userId,
    excludeLessons,
    offset: start,
    limit,
    search,
  }) {
    const end = start + limit - 1;

    return this.query()
      .skipUndefined()
      .select(
        'lessons.*',
        this.knex().raw(`
          json_build_object('id', author.id, 'firstName', author."firstName", 'lastName', author."lastName") author
        `),
        this.knex().raw(`
          (select count(*) from results where lesson_id = lessons.id and action in ('next', 'response')) interactive_passed
        `),
        this.knex().raw(`
          (select count(*) from lesson_block_structure join blocks on blocks.block_id = lesson_block_structure.block_id
          where blocks.type in ('next', 'quiz') and lesson_block_structure.lesson_id = lessons.id) interactive_total
        `),
      )
      .from(
        this.knex().raw(`
          (select id, first_name as "firstName", last_name as "lastName" from users) author
        `),
      )
      .join('users_roles', 'users_roles.user_id', '=', 'author.id')
      .join('lessons', 'lessons.id', '=', 'users_roles.resource_id')
      .join(
        this.knex().raw('users_roles enrolled'),
        'enrolled.resource_id',
        '=',
        'lessons.id',
      )
      .where('users_roles.role_id', config.roles.MAINTAINER.id)
      .andWhere('enrolled.role_id', config.roles.STUDENT.id)
      .andWhere('enrolled.user_id', userId)
      .andWhere('users_roles.resource_type', config.resources.LESSON)
      .whereNotIn('lessons.id', excludeLessons || undefined)
      .andWhere(
        this.knex().raw(
          `concat(author."firstName", ' ', author."lastName", ' ', author."firstName", ' ', lessons.name)`,
        ),
        'ilike',
        `%${search ? search.replace(/ /g, '%') : '%'}%`,
      )
      .range(start, end);
  }

  static getAllEnrolled({ columns, search, userId }) {
    const [firstName, lastName] = search?.split(' ') || [];
    return (
      this.query()
        .skipUndefined()
        .select(
          objection.raw(
            `"lessons"."id" as "id", "lessons"."name" as "name", "lessons"."description" as "description","lessons"."status" as "status", "lessons"."created_at" as "created_at", "lessons"."updated_at" as "updated_at"`,
          ),
        )
        .leftJoin('users_roles as enrolled', (builder) => {
          builder
            .on('enrolled.resource_id', '=', 'lessons.id')
            .andOn(
              'enrolled.resource_type',
              '=',
              objection.raw('?', ['lesson']),
            )
            .andOn(
              'enrolled.role_id',
              '=',
              objection.raw('?', [config.roles.STUDENT.id]),
            );
        })
        .withGraphJoined('maintainer.[users(onlyFullName) as userInfo]')
        .whereIn('maintainer.role_id', [config.roles.MAINTAINER.id])
        .modifiers({
          onlyFullName(builder) {
            builder.select('first_name', 'last_name');
          },
        })
        .where('enrolled.user_id', userId)
        // eslint-disable-next-line func-names
        .where(function () {
          // eslint-disable-next-line func-names
          this.where(function () {
            this.skipUndefined()
              .where(columns.name, 'ilike', `%${search}%`)
              .orWhere(columns.firstName, 'ilike', `%${search}%`)
              .orWhere(columns.lastName, 'ilike', `%${search}%`);
          }).modify((queryBuilder) => {
            if (firstName && lastName) {
              queryBuilder.orWhere(
                objection.raw(`concat(first_name,' ',last_name)`),
                'ilike',
                `%${firstName}% %${lastName}%`,
              );
            }
          });
        })
    );
  }
}

export default Lesson;
