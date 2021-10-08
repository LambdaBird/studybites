import BaseModel from './BaseModel';

export default class File extends BaseModel {
  static get tableName() {
    return 'files';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        type: { type: 'string' },
        location: { type: 'string' },
        createdAt: { type: 'string' },
      },
    };
  }
}
