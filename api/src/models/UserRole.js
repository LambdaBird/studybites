import objection from 'objection';
import path from 'path';

import { roles, resources, userServiceErrors as errors } from '../config';
import { BadRequestError, NotFoundError } from '../validation/errors';

import BaseModel from './BaseModel';

class UserRole extends BaseModel {
  static get tableName() {
    return 'users_roles';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        userId: { type: 'integer' },
        roleId: { type: 'integer' },
        resourceType: { type: 'string' },
        resourceId: { type: 'integer' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static relationMappings() {
    return {
      users: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'users_roles.user_id',
          to: 'users.id',
        },
      },
      lessons: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Lesson'),
        join: {
          from: 'users_roles.resource_id',
          to: 'lessons.id',
        },
      },
      role: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Role'),
        join: {
          from: 'users_roles.role_id',
          to: 'roles.id',
        },
      },
    };
  }

  static async addTeacher({ userId }) {
    const checkNotPassed = await this.query().findOne({
      userId,
      roleId: roles.TEACHER.id,
    });

    if (checkNotPassed) {
      throw new BadRequestError(errors.USER_ERR_FAIL_ALTER_ROLE);
    }

    await this.query()
      .insert({
        userId,
        roleId: roles.TEACHER.id,
      })
      .returning('*');
  }

  static async removeTeacher({ userId }) {
    const checkPassed = await this.query().findOne({
      userId,
      roleId: roles.TEACHER.id,
    });

    if (!checkPassed) {
      throw new NotFoundError(errors.USER_ERR_ROLE_NOT_FOUND);
    }

    await this.query().delete().where({
      userId,
      roleId: roles.TEACHER.id,
    });
  }

  static getLessonStudentsCount({ lessonId }) {
    return this.query()
      .where({
        resourceId: lessonId,
        roleId: roles.STUDENT.id,
        resourceType: resources.LESSON.name,
      })
      .count()
      .first();
  }

  static async addMaintainer({ trx, userId, resourceId }) {
    await this.query(trx)
      .insert({
        userId,
        resourceId,
        roleId: roles.MAINTAINER.id,
        resourceType: resources.LESSON.name,
      })
      .returning('*');
  }

  static enrollToLesson({ userId, lessonId }) {
    return this.query()
      .insert({
        userId,
        roleId: roles.STUDENT.id,
        resourceType: resources.LESSON.name,
        resourceId: lessonId,
      })
      .returning('*');
  }
}

export default UserRole;
