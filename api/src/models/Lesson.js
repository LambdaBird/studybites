import objection from 'objection';
import path from 'path';

import config from '../config';

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

      authors: {
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

  static getAllPublicLessons({ offset, limit, search, userId }) {
    const firstIndex = parseInt(offset, 10) || 0;
    const lastIndex =
      firstIndex +
      (parseInt(limit, 10) || config.search.LESSON_SEARCH_LIMIT) -
      1;
    const [firstName, lastName] = search?.split(' ') || [];
    return this.query()
      .skipUndefined()
      .where(
        search
          ? function () {
              this.where('name', 'ilike', `%${search}%`)
                .orWhere('firstName', 'ilike', `%${search}%`)
                .orWhere('lastName', 'ilike', `%${search}%`);
            }
          : undefined,
      )
      .modify((queryBuilder) => {
        if (firstName && lastName) {
          queryBuilder.orWhere(
            objection.raw(`concat(first_name,' ',last_name)`),
            'ilike',
            `%${firstName}% %${lastName}%`,
          );
        }
      })
      .where({
        status: 'Public',
      })
      .select(
        objection.raw(
          `lessons.*, users.first_name, users.last_name, case when (
            select role_id from users_roles where role_id = ? and user_id = ? and resource_id = lessons.id
            ) is null then false else true end as is_enrolled`,
          [config.roles.STUDENT.id, userId],
        ),
      )
      .join('users_roles', (builder) => {
        builder
          .on('lessons.id', '=', 'users_roles.resource_id')
          .andOn(
            'users_roles.resource_type',
            '=',
            objection.raw('?', ['lesson']),
          )
          .andOn(
            'users_roles.role_id',
            '=',
            objection.raw('?', [config.roles.MAINTAINER.id]),
          );
      })
      .join('users', 'users_roles.user_id', '=', 'users.id')
      .range(firstIndex, lastIndex);
  }

  static getAllEnrolled({ columns, search, userId }) {
    const [firstName, lastName] = search?.split(' ') || [];
    return this.query()
      .skipUndefined()
      .select(
        objection.raw(
          `"lessons"."id" as "id", "lessons"."name" as "name", "lessons"."description" as "description","lessons"."status" as "status", "lessons"."created_at" as "created_at", "lessons"."updated_at" as "updated_at"`,
        ),
      )
      .leftJoin('users_roles as enrolled', (builder) => {
        builder
          .on('enrolled.resource_id', '=', 'lessons.id')
          .andOn('enrolled.resource_type', '=', objection.raw('?', ['lesson']))
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
      .where(function () {
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
      });
  }
}

export default Lesson;
