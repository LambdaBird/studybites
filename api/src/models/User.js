import objection from 'objection';
import path from 'path';

import BaseModel from './BaseModel';

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        isSuperAdmin: { type: 'boolean' },
        description: { type: 'string' },
        isConfirmed: { type: 'boolean' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static relationMappings() {
    return {
      users_roles: {
        relation: objection.Model.HasManyRelation,
        modelClass: path.join(__dirname, 'UserRole'),
        join: {
          from: 'users.id',
          to: 'users_roles.user_id',
        },
      },
    };
  }
}

export default User;
