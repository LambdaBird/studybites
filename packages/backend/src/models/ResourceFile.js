import BaseModel from './BaseModel';

export default class ResourceFile extends BaseModel {
  static get tableName() {
    return 'resource_files';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        user_id: { type: 'integer' },
        file_id: { type: 'integer' },
        resource_id: { type: 'integer' },
        resource_type: { type: 'string' },
        resource_uuid: { type: 'string' },
      },
    };
  }
}
