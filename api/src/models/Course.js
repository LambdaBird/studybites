import objection from 'objection';
import * as path from 'path';

import { courseServiceErrors as errors, resources, roles } from '../config';
import { BadRequestError, NotFoundError } from '../validation/errors';

import BaseModel from './BaseModel';

export default class Course extends BaseModel {
  static get tableName() {
    return 'courses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        status: {
          type: 'string',
          enum: ['Draft', 'Public', 'Private', 'Archived'],
          default: 'Draft',
        },
      },
    };
  }

  static relationMappings() {
    return {
      author: {
        relation: objection.Model.HasOneThroughRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'courses.id',
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
              resource_type: resources.COURSE.name,
            })
            .select('id', 'first_name', 'last_name');
        },
      },

      students: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'courses.id',
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
              resource_type: resources.COURSE.name,
              role_id: roles.STUDENT.id,
            })
            .select('id', 'first_name', 'last_name');
        },
      },

      lessons: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Lesson'),
        join: {
          from: 'courses.id',
          through: {
            modelClass: path.join(__dirname, 'CourseLessonStructure'),
            from: 'course_lesson_structure.course_id',
            to: 'course_lesson_structure.lesson_id',
          },
          to: 'lessons.id',
        },
      },

      keywords: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Keyword'),
        join: {
          from: 'courses.id',
          through: {
            modelClass: path.join(__dirname, 'ResourceKeyword'),
            from: 'resource_keywords.resource_id',
            to: 'resource_keywords.keyword_id',
          },
          to: 'keywords.id',
        },
        modify: (query) => {
          return query.where({ resource_type: resources.COURSE.name });
        },
      },
    };
  }

  static createCourse({ trx, course }) {
    return this.query(trx).insert(course).returning('*');
  }

  static findById({ courseId }) {
    return this.query()
      .findById(courseId)
      .throwIfNotFound({
        error: new NotFoundError(errors.COURSE_ERR_COURSE_NOT_FOUND),
      });
  }

  static updateCourse({ trx, courseId, course }) {
    return this.query(trx).findById(courseId).patch(course).returning('*');
  }

  static getCourseWithLessons({ courseId }) {
    return this.query().findById(courseId).withGraphFetched('lessons');
  }

  static getAllCoursesByLessonId({ lessonId }) {
    return this.query()
      .join(
        'course_lesson_structure',
        'courses.id',
        '=',
        'course_lesson_structure.course_id',
      )
      .where('course_lesson_structure.lesson_id', '=', lessonId);
  }

  static updateCourseStatus({ courseId, status }) {
    return this.query().findById(courseId).patch({ status }).returning('*');
  }

  static updateCoursesStatus({ courses, status }) {
    return this.query()
      .insert(
        courses.map(({ id, name }) => ({
          id,
          name,
          status,
        })),
      )
      .onConflict('id')
      .merge('status');
  }

  static getAllMaintainableCourses({
    userId,
    offset: start,
    limit,
    search,
    status,
  }) {
    const end = start + limit - 1;
    return this.query()
      .skipUndefined()
      .join('users_roles', (builder) =>
        builder
          .on('courses.id', '=', 'users_roles.resource_id')
          .andOn('users_roles.role_id', '=', roles.MAINTAINER.id)
          .andOn(
            'users_roles.resource_type',
            '=',
            this.knex().raw('?', [resources.COURSE.name]),
          ),
      )
      .where('users_roles.user_id', userId)
      .andWhere('courses.status', status)
      .andWhere(
        'courses.name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .groupBy('courses.id')
      .range(start, end)
      .withGraphFetched('students')
      .withGraphFetched('lessons');
  }

  static getAllPublicCourses({ userId, offset: start, limit, search, tags }) {
    const end = start + limit - 1;

    const query = this.query()
      .skipUndefined()
      .select(
        'courses.*',
        this.knex().raw(`
          (select cast(case when count(*) > 0 then true else false end as bool)
           from users_roles
           where role_id = ${roles.STUDENT.id}
             and user_id = ${userId}
             and resource_type = '${resources.COURSE.name}'
             and resource_id = courses.id) is_enrolled
        `),
      )
      .joinRaw(
        `left join resource_keywords on courses.id = resource_keywords.resource_id 
        and resource_keywords.resource_type = '${resources.COURSE.name}'`,
      )
      .where('courses.status', 'Public')
      .andWhere(
        'courses.name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .groupBy('courses.id')
      .range(start, end)
      .withGraphFetched('author')
      .withGraphFetched('keywords');

    if (tags) {
      return query
        .whereIn('resource_keywords.keyword_id', tags)
        .havingRaw('count(resource_keywords.keyword_id) = ?', [tags.length]);
    }
    return query;
  }

  static getCourseWithAuthor({ courseId, userId }) {
    const query = this.query().findById(courseId);

    if (userId) {
      query.select(
        'courses.*',
        this.knex().raw(`
          (select cast(case when count(*) > 0 then true else false end as bool)
           from users_roles
           where role_id = ${roles.STUDENT.id}
             and user_id = ${userId}
             and resource_type = '${resources.COURSE.name}'
             and resource_id = courses.id) is_enrolled
        `),
      );
    }

    return query.withGraphFetched('author');
  }

  static async getCourseWithAuthorAndLessons({ courseId, lessons }) {
    const course = await this.getCourseWithAuthor({ courseId });
    course.lessons = lessons.map((lesson) => ({
      ...lesson,
      isEnrolled: !!lesson.roleId,
      isFinished: !!lesson.results.length,
    }));
    const currentLessonIndex = course.lessons.findIndex(
      (lesson) => !lesson.isFinished,
    );
    if (currentLessonIndex >= 0) {
      course.lessons[currentLessonIndex].isCurrent = true;
    }
    return course;
  }

  static checkIfEnrolled({ courseId, userId }) {
    return this.query()
      .findById(courseId)
      .where({ status: 'Public' })
      .whereNotIn(
        'id',
        this.knex().raw(`
            select resource_id
            from users_roles
            where user_id = ${userId}
              and role_id = ${roles.STUDENT.id}
              and resource_type = '${resources.COURSE.name}'
        `),
      )
      .throwIfNotFound({
        error: new BadRequestError(errors.COURSE_ERR_FAIL_ENROLL),
      });
  }

  static getAllFinishedCourses({ userId, offset: start, limit, search }) {
    const end = start + limit - 1;

    return this.query()
      .skipUndefined()
      .join('users_roles', (builder) =>
        builder
          .on('courses.id', '=', 'users_roles.resource_id')
          .andOn('users_roles.role_id', '=', roles.STUDENT.id)
          .andOn(
            'users_roles.resource_type',
            '=',
            this.knex().raw('?', [resources.COURSE.name]),
          ),
      )
      .join(
        'course_lesson_structure',
        'courses.id',
        '=',
        'course_lesson_structure.course_id',
      )
      .where('users_roles.user_id', userId)
      .andWhere(
        'courses.name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .groupBy('courses.id')
      .havingRaw(
        `count(course_lesson_structure.lesson_id) = (
          select count(results.id) from course_lesson_structure structure
            join results on structure.lesson_id = results.lesson_id
           where structure.course_id = courses.id
            and results.user_id = ${userId}
            and results.action = 'finish'
        )`,
      )
      .range(start, end)
      .withGraphFetched('author');
  }

  static getOngoingCourses({ userId, offset: start, limit, search }) {
    const end = start + limit - 1;

    return this.query()
      .skipUndefined()
      .join('users_roles', (builder) =>
        builder
          .on('courses.id', '=', 'users_roles.resource_id')
          .andOn('users_roles.role_id', '=', roles.STUDENT.id)
          .andOn(
            'users_roles.resource_type',
            '=',
            this.knex().raw('?', [resources.COURSE.name]),
          ),
      )
      .join(
        'course_lesson_structure',
        'courses.id',
        '=',
        'course_lesson_structure.course_id',
      )
      .where('users_roles.user_id', userId)
      .whereNotIn('course_lesson_structure.lesson_id', (builder) =>
        builder
          .select('results.lesson_id')
          .from('course_lesson_structure as structure')
          .join('results', 'structure.lesson_id', '=', 'results.lesson_id')
          .whereRaw('structure.course_id = courses.id')
          .andWhere('results.user_id', userId)
          .whereRaw(`results.action = 'finish'`),
      )
      .andWhere(
        'courses.name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .groupBy('courses.id')
      .range(start, end)
      .withGraphFetched('author');
  }
}
