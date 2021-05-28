import objection, { Model } from 'objection';

import Role from './Role';
import Lesson from './Lesson';
import User from './User';

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
      roleId: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users_roles.role_id',
          to: 'roles.id',
        },
      },
      lessons: {
        relation: Model.BelongsToOneRelation,
        modelClass: Lesson,
        join: {
          from: 'users_roles.resource_id',
          to: 'lessons.id',
        },
      },
      users: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users_roles.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

export default UserRole;
