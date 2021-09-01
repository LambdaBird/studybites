import BaseModel from './BaseModel';

export default class CourseLessonStructure extends BaseModel {
  static get tableName() {
    return 'course_lesson_structure';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        courseId: { type: 'number' },
        lessonId: { type: 'number' },
        childId: { type: ['string', 'null'] },
        parentId: { type: ['string', 'null'] },
      },
    };
  }
}
