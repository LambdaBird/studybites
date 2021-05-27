import objection from 'objection';

class Role extends objection.Model {
  static get tableName() {
    return 'roles';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
      },
    };
  }
}

export default Role;
