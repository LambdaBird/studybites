import objection from 'objection';
import * as path from 'path';

import BaseModel from './BaseModel';
import { resources, roles } from '../config';

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
          from: 'lessons.id',
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
          from: 'lessons.id',
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
}
