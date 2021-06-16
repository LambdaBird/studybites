import objection from 'objection';

class Block extends objection.Model {
  static get tableName() {
    return 'blocks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        blockId: { type: 'string' },
        revision: { type: 'string' },
        content: { type: 'object' },
        type: { type: 'string' },
        answer: { type: 'object' },
        weight: { type: 'number' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }
}

export default Block;
