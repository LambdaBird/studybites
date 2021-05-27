import objection, { Model } from 'objection';
import UserRole from './UserRole';

class User extends objection.Model {
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
        secondName: { type: 'string' },
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
      id: {
        relation: Model.HasManyRelation,
        modelClass: UserRole,
        join: {
          from: 'users.id',
          to: 'users_roles.user_id',
        },
      },
    };
  }
}

export default User;
