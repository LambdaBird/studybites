import objection from 'objection';

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
}

export default User;
