import { v4 } from 'uuid';

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

  static async insertLessons({ trx, lessons, courseId, update = false }) {
    const lessonStructure = lessons
      .map((lesson) => ({
        id: v4(),
        course_id: courseId,
        lesson_id: lesson.id,
      }))
      .map((lesson, index, lessonsToStructure) => ({
        ...lesson,
        parent_id: !index ? null : lessonsToStructure[index - 1].id,
        child_id:
          index === lessonsToStructure.length - 1
            ? null
            : lessonsToStructure[index + 1].id,
      }));

    if (update) {
      await this.query(trx).delete().where({
        course_id: courseId,
      });
    }
    await this.query(trx).insert(lessonStructure);
  }

  static #sortLessons({ lessonsUnordered }) {
    const dictionary = lessonsUnordered.reduce(
      (result, filter) => ({
        ...result,
        [filter.id]: filter,
      }),
      {},
    );

    return lessonsUnordered.reduce(
      (result, value, index) => [
        ...result,
        index ? dictionary[result[index - 1].childId] : value,
      ],
      [],
    );
  }

  static async getAllLessons({ courseId }) {
    const lessonsUnordered = await this.query()
      .select(
        'lessons.*',
        'course_lesson_structure.id',
        'course_lesson_structure.parent_id',
        'course_lesson_structure.child_id',
      )
      .join('lessons', 'course_lesson_structure.lesson_id', '=', 'lessons.id')
      .where({
        course_id: courseId,
      })
      .orderBy(
        this.knex().raw(`(case when parent_id is null then 0 else 1 end)`),
      );

    if (!lessonsUnordered) {
      return [];
    }

    if (lessonsUnordered.length === 1) {
      return lessonsUnordered;
    }

    return this.#sortLessons({ lessonsUnordered });
  }
}
