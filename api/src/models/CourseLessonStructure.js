import { v4 } from 'uuid';

import objection from 'objection';
import path from 'path';
import BaseModel from './BaseModel';
import { resources, roles } from '../config';
import { BadRequestError } from '../validation/errors';

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
      results: {
        relation: objection.Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Result'),
        join: {
          from: 'course_lesson_structure.lesson_id',
          to: 'results.lesson_id',
        },
      },

      author: {
        relation: objection.Model.HasOneThroughRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'course_lesson_structure.lesson_id',
          through: {
            modelClass: path.join(__dirname, 'UserRole'),
            from: 'users_roles.resource_id',
            to: 'users_roles.user_id',
            extra: 'resource_type',
          },
          to: 'users.id',
        },
        modify: (query) => {
          return query
            .where({
              role_id: roles.MAINTAINER.id,
              resource_type: resources.LESSON.name,
            })
            .select('id', 'first_name', 'last_name');
        },
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
        [filter.structureId]: filter,
      }),
      {},
    );

    const lessonsInOrder = lessonsUnordered.reduce(
      (result, value, index) => [
        ...result,
        index ? dictionary[result[index - 1].childId] : value,
      ],
      [],
    );

    return lessonsInOrder;
  }

  static async getAllLessons({ trx, courseId, userId }) {
    const query = this.query(trx)
      .select(
        'lessons.*',
        'course_lesson_structure.id as structure_id',
        'course_lesson_structure.parent_id',
        'course_lesson_structure.child_id',
        'course_lesson_structure.lesson_id',
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
      .withGraphFetched('author');

    if (userId) {
      query
        .select('users_roles.role_id')
        .leftJoin('users_roles', (builder) =>
          builder
            .on('lessons.id', '=', 'users_roles.resource_id')
            .andOn('users_roles.role_id', '=', roles.STUDENT.id)
            .andOn(
              'users_roles.resource_type',
              '=',
              this.knex().raw('?', [resources.LESSON.name]),
            )
            .andOn('users_roles.user_id', '=', this.knex().raw('?', [userId])),
        )
        .withGraphFetched('results(byUser)')
        .modifiers({
          byUser(builder) {
            builder
              .where('results.user_id', userId)
              .andWhere('results.action', 'finish');
          },
        });
    }

    const lessonsUnordered = await query;

    if (!lessonsUnordered.length) {
      return [];
    }

    if (lessonsUnordered.length === 1) {
      return lessonsUnordered;
    }

    return this.#sortLessons({ lessonsUnordered });
  }

  static async checkIfEnrollAllowed({ courseId, lessonId, userId }) {
    const courseLessons = await this.getAllLessons({
      courseId,
      userId,
    });

    const currentLesson = courseLessons.find(
      (lesson) => !lesson.results.length,
    );
    if (currentLesson.lessonId !== lessonId) {
      throw new BadRequestError('errors.fail_enroll');
    }
  }
}
