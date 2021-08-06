import BaseModel from './BaseModel';

class Block extends BaseModel {
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

  static getBlock({ blockId, revision }) {
    return this.query().first().where({ block_id: blockId, revision });
  }

  static createBlocks({ trx, blocks }) {
    return this.query(trx).insert(blocks).returning('*');
  }

  static getRevisions({ trx }) {
    return this.query(trx)
      .first()
      .select(
        this.knex().raw(
          `json_object_agg(grouped.block_id, grouped.revisions) as values`,
        ),
      )
      .from(
        this.knex().raw(
          `(select block_id, array_agg(revision) as revisions from blocks group by block_id) as grouped`,
        ),
      );
  }
}

export default Block;
