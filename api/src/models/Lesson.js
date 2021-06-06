/* eslint-disable import/no-cycle */
import objection from 'objection';

import User from './User';
import UserRole from './UserRole';

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
