import BaseModel from './BaseModel';

class Role extends BaseModel {
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
