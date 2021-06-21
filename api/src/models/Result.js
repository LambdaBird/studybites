import objection from 'objection';

class Result extends objection.Model {
  static get tableName() {
    return 'results';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        action: { type: 'string' },
        data: { type: 'object' },
        userId: { type: 'number' },
        lessonId: { type: 'number' },
        blockId: { type: 'string' },
        revision: { type: 'string' },
        correctness: { type: 'number' },
        meta: { type: 'object' },
        createdAt: { type: 'string' },
      },
    };
  }
}

export default Result;
