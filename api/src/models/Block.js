import objection from 'objection';

class Block extends objection.Model {
  static get tableName() {
    return 'blocks';
  }

  static createBlocks({ trx, blocks }) {
    return this.query(trx).insert(blocks).returning('*');
  }

  static getRevisions({ trx, knex }) {
    return this.query(trx)
      .first()
      .select(
        knex.raw(
          `json_object_agg(grouped.block_id, grouped.revisions) as values`,
        ),
      )
      .from(
        knex.raw(
          `(select block_id, array_agg(revision) as revisions from blocks group by block_id) as grouped`,
        ),
      );
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
