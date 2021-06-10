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
        id: { type: 'number' },
        lessonID: { type: 'number' },
        blockID: { type: 'string' },
        childID: { type: 'number' },
        parentID: { type: 'number' },
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

      block: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Block'),
        join: {
          from: 'lesson_block_structure.block_id',
          to: 'blocks.block_id',
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
