import BaseModel from './BaseModel';

import { blockConstants } from '../config';

import { getQuizCorrectness } from './blocks/quiz';
import { getClosedQuestionCorrectness } from './blocks/closedQuestion';
import { getFillTheGapCorrectness } from './blocks/fillTheGap';
import { getBricksCorrectness } from './blocks/bricks';

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

  static async getCorrectness({ blockId, revision, userResponse }) {
    const { answer, type, weight } = await Block.getBlock({
      blockId,
      revision,
    });

    switch (type) {
      case blockConstants.blocks.QUIZ: {
        return getQuizCorrectness({
          solution: answer.results,
          userResponse,
          blockWeight: weight,
        });
      }
      case blockConstants.blocks.CLOSED_QUESTION: {
        return getClosedQuestionCorrectness({
          solution: answer.results,
          userResponse,
          blockWeight: weight,
        });
      }
      case blockConstants.blocks.FILL_THE_GAP: {
        return getFillTheGapCorrectness({
          solution: answer,
          userResponse,
          blockWeight: weight,
        });
      }
      case blockConstants.blocks.BRICKS: {
        return getBricksCorrectness({
          solution: answer.words,
          userResponse,
          blockWeight: weight,
        });
      }
      default:
        return { error: null, correctness: 0 };
    }
  }
}

export default Block;
