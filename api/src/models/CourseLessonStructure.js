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
    const lessonStructure = [];

    for (let i = 0, n = lessons.length; i < n; i += 1) {
      lessonStructure.push({
        id: v4(),
        course_id: courseId,
        lesson_id: lessons[i].id,
      });
    }

    for (let i = 0, n = lessonStructure.length; i < n; i += 1) {
      lessonStructure[i].parent_id = !i ? null : lessonStructure[i - 1].id;
      lessonStructure[i].child_id =
        i === n - 1 ? null : lessonStructure[i + 1].id;
    }

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

    const lessonsInOrder = [];

    if (lessonsUnordered.length) {
      const block = lessonsUnordered[0];
      lessonsInOrder.push(block);
    }

    for (let i = 0, n = lessonsUnordered.length - 1; i < n; i += 1) {
      const block = dictionary[lessonsInOrder[i].childId];
      lessonsInOrder.push(block);
    }

    return lessonsInOrder;
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
