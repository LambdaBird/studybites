/* eslint-disable import/no-cycle */
import objection from 'objection';

import User from './User';
import UserRole from './UserRole';

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
      users: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: User,
        filter: (query) => query.select('id', 'first_name', 'second_name'),
        join: {
          from: 'lessons.id',
          through: {
            from: 'users_roles.resource_id',
            to: 'users_roles.user_id',
          },
          to: 'users.id',
        },
      },
      users_roles: {
        relation: objection.Model.HasManyRelation,
        modelClass: UserRole,
        join: {
          from: 'lessons.id',
          to: 'users_roles.resource_id',
        },
      },
    };
  }
}

export default Lesson;
