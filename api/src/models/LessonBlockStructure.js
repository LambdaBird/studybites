import objection from 'objection';
import path from 'path';

import config from '../../config';

class LessonBlockStructure extends objection.Model {
  static get tableName() {
    return 'lesson_block_structure';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        lessonId: { type: 'number' },
        blockId: { type: 'string' },
        childId: { type: ['string', 'null'] },
        parentId: { type: ['string', 'null'] },
      },
    };
  }

  static #sortBlocks({ blocksUnordered }) {
    const dictionary = blocksUnordered.reduce((result, filter) => {
      // eslint-disable-next-line no-param-reassign
      result[filter.id] = filter;
      return result;
    }, {});

    const blocksInOrder = [];

    if (blocksUnordered.length) {
      blocksInOrder.push(blocksUnordered[0]);
    }

    for (let i = 0, n = blocksUnordered.length - 1; i < n; i += 1) {
      blocksInOrder.push(dictionary[blocksInOrder[i].childId]);
    }

    return blocksInOrder;
  }

  static #findChunk({ blocks, startIndex }) {
    let remainingBlocks = blocks;

    if (startIndex) {
      remainingBlocks = blocks.slice(startIndex);
    }

    const dictionary = remainingBlocks.map((block) => block.type);

    for (let i = 0, n = dictionary.length; i < n; i += 1) {
      if (config.interactiveBlocks.includes(dictionary[i])) {
        return remainingBlocks.slice(0, i + 1);
      }
    }

    return remainingBlocks;
  }

  static async getAllBlocks({ lessonId }) {
    const blocksUnordered = await this.query()
      .select(
        'blocks.*',
        'lesson_block_structure.id',
        'lesson_block_structure.parent_id',
        'lesson_block_structure.child_id',
      )
      .join('blocks', 'blocks.block_id', '=', 'lesson_block_structure.block_id')
      .join(
        this.knex().raw(
          `(select block_id, MAX(created_at) as created_at from blocks group by block_id) recent`,
        ),
        'recent.block_id',
        '=',
        'blocks.block_id',
      )
      .where({
        lessonId,
      })
      .andWhere(this.knex().raw(`recent.created_at = blocks.created_at`))
      .orderBy(
        this.knex().raw(`(case when parent_id is null then 0 else 1 end)`),
      );

    if (blocksUnordered.length === 1) {
      return blocksUnordered;
    }

    if (!blocksUnordered.length) {
      return [];
    }

    return this.#sortBlocks({ blocksUnordered });
  }

  static async getChunk({ lessonId, previousBlock = null }) {
    const blocks = await this.getAllBlocks({ lessonId });

    if (blocks.length === 1) {
      return blocks;
    }

    if (!previousBlock) {
      return this.#findChunk({ blocks });
    }

    const dictionary = blocks.map((block) => block.blockId);

    for (let i = 0, n = dictionary.length; i < n; i += 1) {
      if (dictionary[i] === previousBlock) {
        return this.#findChunk({
          blocks,
          startIndex: i + 1,
        });
      }
    }

    return [];
  }

  static relationMappings() {
    return {
      parent: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'LessonBlockStructure'),
        join: {
          from: 'lesson_block_structure.parent_id',
          to: 'lesson_block_structure.id',
        },
      },

      child: {
        relation: objection.Model.HasOneRelation,
        modelClass: path.join(__dirname, 'LessonBlockStructure'),
        join: {
          from: 'lesson_block_structure.child_id',
          to: 'lesson_block_structure.id',
        },
      },

      blocksRevisions: {
        relation: objection.Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Block'),
        join: {
          from: 'lesson_block_structure.block_id',
          to: 'blocks.block_id',
        },
        modify: (query) => {
          return query.orderBy('blocks.block_id');
        },
      },

      blocks: {
        relation: objection.Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Block'),
        join: {
          from: 'lesson_block_structure.block_id',
          to: 'blocks.block_id',
        },
        modify: (query) => {
          return query
            .select('b.*')
            .from(
              objection.raw(
                `(select block_id, MAX(created_at) as created_at from blocks group by block_id) as blocks`,
              ),
            )
            .join(
              objection.raw(
                `blocks as b on b.block_id = blocks.block_id and b.created_at = blocks.created_at`,
              ),
            );
        },
      },

      lesson: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Lesson'),
        join: {
          from: 'lesson_block_structure.lesson_id',
          to: 'lessons.id',
        },
      },
    };
  }
}

export default LessonBlockStructure;
