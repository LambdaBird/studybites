import objection from 'objection';
import path from 'path';

import config from '../../config';

class Lesson extends objection.Model {
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

      maintainers: {
        relation: objection.Model.ManyToManyRelation,
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

  /**
   * get all lessons where status = 'Public' with maintainers,
   * search, pagination and total
   */
  static getAllPublicLessons({ knex, userId, offset, limit, search }) {
    const start = offset;
    const end = start + limit - 1;

    return (
      this.query()
        .select(
          'lessons.*',
          /**
           * using cast to set is_enrolled field to true if user is enrolled to this lesson
           *
           * using json_agg to aggregate maintainers (users_data) json data to an array of objects
           */
          knex.raw(`
            (select cast(case when count(*) > 0 then true else false end as bool)
              from users_roles
              where role_id = ${config.roles.STUDENT.id}
                and user_id = ${userId}
                and resource_type = '${config.resources.LESSON}'
                and resource_id = lessons.id) is_enrolled,
            json_agg(users_data) maintainers
        `),
        )
        .from(
          knex.raw(`
            (select id, first_name as "firstName", last_name as "lastName" from users) users_data
        `),
        )
        .join('users_roles', 'users_roles.user_id', '=', 'users_data.id')
        .join('lessons', 'lessons.id', '=', 'users_roles.resource_id')
        .where('users_roles.role_id', config.roles.MAINTAINER.id)
        .andWhere('users_roles.resource_type', config.resources.LESSON)
        .andWhere('lessons.status', 'Public')
        /**
         * using concat to concatenate fields to search through
         */
        .andWhere(
          knex.raw(
            `concat(users_data."firstName", ' ', users_data."lastName", ' ', users_data."firstName", ' ', lessons.name)`,
          ),
          'ilike',
          `%${search ? search.replace(/ /g, '%') : '%'}%`,
        )
        .groupBy('lessons.id')
        .range(start, end)
    );
  }

  static getAllFinishedLessons({ knex, userId, offset: start, limit, search }) {
    const end = start + limit - 1;

    return this.query()
      .select('lessons.*', knex.raw(`json_agg(users_data) maintainers`))
      .from(
        knex.raw(`
        (select id, first_name as "firstName", last_name as "lastName" from users) users_data
        `),
      )
      .join('users_roles', 'users_roles.user_id', '=', 'users_data.id')
      .join('lessons', 'lessons.id', '=', 'users_roles.resource_id')
      .join(
        knex.raw('users_roles learn'),
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
        knex.raw(
          `concat(users_data."firstName", ' ', users_data."lastName", ' ', users_data."firstName", ' ', lessons.name)`,
        ),
        'ilike',
        `%${search ? search.replace(/ /g, '%') : '%'}%`,
      )
      .groupBy('lessons.id')
      .range(start, end);
  }

  /**
   * get all students enrolled to teacher`s lessons
   * with search, pagination and total
   */
  static getAllEnrolledStudents({
    knex,
    userId,
    offset: start,
    limit,
    search,
  }) {
    const end = start + limit - 1;

    return (
      this.query()
        .select(
          'users.id',
          'users.email',
          'users.first_name',
          'users.last_name',
        )
        .join('users_roles', 'users_roles.resource_id', '=', 'lessons.id')
        .join(
          knex.raw(`users_roles students`),
          'students.resource_id',
          '=',
          'lessons.id',
        )
        .join('users', 'users.id', '=', 'students.user_id')
        .where('users_roles.role_id', config.roles.MAINTAINER.id)
        .andWhere('users_roles.user_id', userId)
        .andWhere('students.role_id', config.roles.STUDENT.id)
        /**
         * using concat to concatenate fields to search through
         */
        .andWhere(
          knex.raw(
            `concat(users.email, ' ', users.first_name, ' ', users.last_name, ' ', users.first_name)`,
          ),
          'ilike',
          `%${search ? search.replace(/ /g, '%') : '%'}%`,
        )
        .groupBy('users.id')
        .range(start, end)
    );
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
      .range(start, end);
  }

  /**
   * get all lessons user had enrolled to
   */
  static getOngoingLessons({
    knex,
    userId,
    excludeLessons,
    offset: start,
    limit,
    search,
  }) {
    const end = start + limit - 1;

    return this.query()
      .select('lessons.*', knex.raw(`json_agg(users_data) maintainers`))
      .from(
        knex.raw(`
        (select id, first_name as "firstName", last_name as "lastName" from users) users_data
        `),
      )
      .join('users_roles', 'users_roles.user_id', '=', 'users_data.id')
      .join('lessons', 'lessons.id', '=', 'users_roles.resource_id')
      .join(
        knex.raw('users_roles learn'),
        'learn.resource_id',
        '=',
        'lessons.id',
      )
      .where('users_roles.role_id', config.roles.MAINTAINER.id)
      .andWhere('learn.role_id', config.roles.STUDENT.id)
      .andWhere('learn.user_id', userId)
      .andWhere('users_roles.resource_type', config.resources.LESSON)
      .whereNotIn('lessons.id', excludeLessons)
      .andWhere(
        knex.raw(
          `concat(users_data."firstName", ' ', users_data."lastName", ' ', users_data."firstName", ' ', lessons.name)`,
        ),
        'ilike',
        `%${search ? search.replace(/ /g, '%') : '%'}%`,
      )
      .groupBy('lessons.id')
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
