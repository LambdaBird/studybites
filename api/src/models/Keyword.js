import objection from 'objection';
import path from 'path';

import BaseModel from './BaseModel';
import { resources } from '../config';
import ResourceKeyword from './ResourceKeyword';

export default class Keyword extends BaseModel {
  static get tableName() {
    return 'keywords';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
      },
    };
  }

  static relationMappings() {
    return {
      lessons: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Lesson'),
        join: {
          from: 'keywords.id',
          through: {
            from: 'resource_keywords.keyword_id',
            to: 'resource_keywords.resource_id',
          },
          to: 'lessons.id',
        },
        modify: (query) => {
          return query.where({
            resource_type: 'lesson',
          });
        },
      },
    };
  }

  static getAll({ search, offset, limit }) {
    const start = offset;
    const end = start + limit - 1;

    return this.query()
      .skipUndefined()
      .where(
        'name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .range(start, end);
  }

  static async createMany({
    trx,
    keywords,
    resourceId,
    resourceType,
    update = false,
  }) {
    await this.query(trx).insert(keywords).onConflict('name').ignore();
    const keywordIds = await this.getId({ trx, keywords });
    const resourceKeywords = keywordIds.map(({ keywordId }) => ({
      keyword_id: keywordId,
      resource_id: resourceId,
      resource_type: resourceType,
    }));
    if (update) {
      await ResourceKeyword.deleteMany({ trx, resourceId, resourceType });
    }
    await ResourceKeyword.createMany({ trx, resourceKeywords });
  }

  static getId({ trx, keywords }) {
    const keywordNames = keywords.map((keyword) => keyword.name);
    return this.query(trx)
      .select('id as keyword_id')
      .whereIn('name', keywordNames);
  }
}
