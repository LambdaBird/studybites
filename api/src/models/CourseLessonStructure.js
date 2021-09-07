import { v4 } from 'uuid';
import objection from 'objection';
import path from 'path';
import BaseModel from './BaseModel';
import { resources, roles } from '../config';

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

  static relationMappings() {
    return {
      students: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'course_lesson_structure.lesson_id',
          through: {
            modelClass: path.join(__dirname, 'UserRole'),
            from: 'users_roles.resource_id',
            to: 'users_roles.user_id',
          },
          to: 'users.id',
        },
        modify: (query) => {
          return query
            .where({
              resource_type: resources.LESSON.name,
              role_id: roles.STUDENT.id,
            })
            .select('id', 'first_name', 'last_name');
        },
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
        [filter.structureId]: filter,
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

  static async getAllLessons({ trx, courseId }) {
    const lessonsUnordered = await this.query(trx)
      .select(
        'lessons.*',
        this.knex().raw('course_lesson_structure.id structure_id'),
        'course_lesson_structure.parent_id',
        'course_lesson_structure.child_id',
      )
      .leftJoin(
        'lessons',
        'course_lesson_structure.lesson_id',
        '=',
        'lessons.id',
      )
      .where('course_lesson_structure.course_id', courseId)
      .orderBy(
        this.knex().raw(`(case when parent_id is null then 0 else 1 end)`),
      )
      .groupBy('course_lesson_structure.id', 'lessons.id')
      .withGraphFetched('students');

    if (!lessonsUnordered.length) {
      return [];
    }

    if (lessonsUnordered.length === 1) {
      return lessonsUnordered;
    }

    return this.#sortLessons({ lessonsUnordered });
  }
}
