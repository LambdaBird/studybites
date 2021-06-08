/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-cycle */
import objection from 'objection';

import BaseQueryBuilder from './BaseQueryBuilder';
import User from './User';
import UserRole from './UserRole';

import config from '../../config';

class LessonQueryBuilder extends BaseQueryBuilder {
  withAuthor() {
    this.select('lessons.*', 'users.first_name', 'users.last_name')
      .innerJoin('users_roles', 'users_roles.resource_id', 'lessons.id')
      .innerJoin('users', 'users.id', 'users_roles.user_id')
      .where('users_roles.role_id', config.roles.MAINTAINER.id);
    return this;
  }

  withEnrollmentStatus() {
    this.select(
      objection.raw(
        `case when (select users_roles.role_id from users_roles where
          users_roles.role_id = 3 and users_roles.user_id = 3 and
          users_roles.resource_id = lessons.id) is null then false
          else true end as is_enrolled`,
      ),
    );
    return this;
  }

  withRole(userID, roleID) {
    this.select('lessons.*').whereIn(
      'lessons.id',
      UserRole.query().select('users_roles.resource_id').where({
        userID,
        roleID,
        resourceType: 'lesson',
      }),
    );
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
        modelClass: User,
        join: {
          from: 'lessons.id',
          through: {
            modelClass: UserRole,
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
        modelClass: User,
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
