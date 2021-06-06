/* eslint-disable import/no-cycle */
import objection from 'objection';

import User from './User';
import Lesson from './Lesson';

import Role from './Role';

class UserRole extends objection.Model {
  static get tableName() {
    return 'users_roles';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        userID: { type: 'integer' },
        roleID: { type: 'integer' },
        resourceType: { type: 'string' },
        resourceID: { type: 'integer' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static relationMappings() {
    return {
      users: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users_roles.user_id',
          to: 'users.id',
        },
      },
      lessons: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Lesson,
        join: {
          from: 'users_roles.resource_id',
          to: 'lessons.id',
        },
      },
      role: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users_roles.role_id',
          to: 'roles.id',
        },
      },
    };
  }
}

export default UserRole;
