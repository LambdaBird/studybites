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
        blockId: { type: ['string', 'null'] },
        revision: { type: ['string', 'null'] },
        correctness: { type: 'number' },
        meta: { type: 'object' },
        createdAt: { type: 'string' },
      },
    };
  }

  static getLastResult({ userId, lessonId }) {
    return this.query()
      .first()
      .where({
        userId,
        lessonId,
      })
      .orderBy('createdAt', 'desc');
  }
}

export default Result;
