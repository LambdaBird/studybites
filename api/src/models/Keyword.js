import objection from 'objection';
import path from 'path';

import BaseModel from './BaseModel';

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

  static createMany({ trx, keywords }) {
    const keywordsToInsert = keywords.map((keyword) => ({ name: keyword }));
    return this.query(trx).insert(keywordsToInsert).onConflict('name').ignore();
  }

  static getId({ trx, keywords }) {
    return this.query(trx).select('id as keyword_id').whereIn('name', keywords);
  }
}
