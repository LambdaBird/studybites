import objection from 'objection';

class Block extends objection.Model {
  static get tableName() {
    return 'blocks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        blockID: { type: 'string' },
        revisionID: { type: 'string' },
        content: { type: 'object' },
        type: { type: 'string' },
        answer: { type: 'object' },
        weight: { type: 'number' },
      },
    };
  }
}

export default Block;
