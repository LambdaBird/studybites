import objection from 'objection';
import path from 'path';

import BaseModel from './BaseModel';
import { roles } from '../config';

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
}
