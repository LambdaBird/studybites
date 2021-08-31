import BaseModel from './BaseModel';

export default class CourseLessonStructure extends BaseModel {
  static get tableName() {
    return 'course_lesson_structure';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'number' },
        courseId: { type: 'number' },
        lessonId: { type: 'number' },
        childId: { type: ['number', 'null'] },
        parentId: { type: ['number', 'null'] },
      },
    };
  }
}
