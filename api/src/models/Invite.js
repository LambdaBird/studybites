import BaseModel from './BaseModel';

class Invite extends BaseModel {
  static get tableName() {
    return 'invites';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        resourceId: { type: 'integer' },
        resourceType: { type: 'string' },
        status: { type: 'string' },
        email: { type: 'string' },
        createdAt: { type: 'string' },
      },
    };
  }
}

export default Invite;
