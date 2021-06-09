/* eslint-disable max-classes-per-file */
import objection from 'objection';
import path from 'path';

import config from '../../config';

class LessonQueryBuilder extends objection.QueryBuilder {
  getAllPublic(columns, req) {
    this.skipUndefined()
      .where(columns.name, 'ilike', `%${req.query.search}%`)
      .where({
        status: 'Public',
      })
      .select(
        objection.raw(
          `lessons.*, users.first_name, users.last_name, case when (
            select role_id from users_roles where role_id = ? and user_id = ? and resource_id = lessons.id
            ) is null then false else true end as is_enrolled`,
          [config.roles.STUDENT.id, req.user.id],
        ),
      )
      .join('users_roles', 'lessons.id', '=', 'users_roles.resource_id')
      .where('users_roles.role_id', config.roles.MAINTAINER.id)
      .join('users', 'users_roles.user_id', '=', 'users.id')
      .offset(req.query.offset || 0)
      .limit(req.query.limit || config.search.LESSON_SEARCH_LIMIT);

    return this;
  }

  countAllPublic(columns, req) {
    this.skipUndefined()
      .where(columns.name, 'ilike', `%${req.query.search}%`)
      .where({
        status: 'Public',
      })
      .count('*');

    return this;
  }
}

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

  static get QueryBuilder() {
    return LessonQueryBuilder;
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
      authors: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'lessons.id',
          through: {
            from: 'users_roles.resource_id',
            to: 'users_roles.user_id',
          },
          to: 'users.id',
        },
        modify: (query) => {
          return query
            .where({
              resource_type: 'lesson',
            })
            .whereIn('role_id', [config.roles.MAINTAINER.id])
            .select('id', 'first_name', 'last_name', 'role_id');
        },
      },
    };
  }
}

export default Lesson;
