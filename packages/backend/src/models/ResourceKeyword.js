import BaseModel from './BaseModel';

export default class ResourceKeyword extends BaseModel {
  static get tableName() {
    return 'resource_keywords';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        keyword_id: { type: 'number' },
        resource_id: { type: 'number' },
        resource_type: { type: 'string' },
      },
    };
  }

  static createMany({ trx, resourceKeywords }) {
    return this.query(trx).insert(resourceKeywords).returning('*');
  }

  static deleteMany({ trx, resourceId, resourceType = 'lesson' }) {
    return this.query(trx).delete().where({
      resource_id: resourceId,
      resource_type: resourceType,
    });
  }

  static getResourceKeywords({ resourceId, resourceType }) {
    return this.query()
      .select('keywords.*')
      .join('keywords', 'keywords.id', '=', 'resource_keywords.keyword_id')
      .where({
        resource_id: resourceId,
        resource_type: resourceType,
      });
  }
}
