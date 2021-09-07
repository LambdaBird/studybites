import objection from 'objection';
import * as path from 'path';

import { courseServiceErrors as errors, resources, roles } from '../config';
import { NotFoundError } from '../validation/errors';

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
      .withGraphFetched('students');
  }
}
