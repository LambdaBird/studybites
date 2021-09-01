import BaseModel from './BaseModel';
import { resources } from '../config';

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

  static async getLessonKeywords({ lessonId }) {
    const keywords = await this.query()
      .select('keywords.name')
      .join('keywords', 'keywords.id', '=', 'resource_keywords.keyword_id')
      .where({
        resource_id: lessonId,
        resource_type: resources.LESSON.name,
      });
    return keywords.map((object) => object.name);
  }
}
