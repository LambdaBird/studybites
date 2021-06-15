import objection from 'objection';
import path from 'path';

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
