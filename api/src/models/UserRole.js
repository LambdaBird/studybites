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
          from: 'users_roles.resourceId',
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
      results: {
        relation: objection.Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Result'),
        join: {
          from: 'users_roles.userId',
          to: 'results.userId',
        },
      },
    };
  }

  static getAllStudentsOfLesson({ lessonId, offset: start, limit, search }) {
    const end = start + limit - 1;
    return this.query()
      .skipUndefined()

      .select('users.id', 'users.email', 'users.first_name', 'users.last_name')
      .innerJoin('users', 'users.id', '=', 'users_roles.user_id')
      .where('users_roles.resource_type', 'lesson')
      .andWhere('users_roles.resource_id', lessonId)
      .andWhere('users_roles.role_id', roles.STUDENT.id)
      .groupBy('users.id', 'users_roles.user_id')
      .andWhere(
        this.knex().raw(
          `concat(users.email, ' ', users.first_name, ' ', users.last_name, ' ', users.first_name)`,
        ),
        'ilike',
        `%${search ? search.replace(/ /g, '%') : '%'}%`,
      )
      .range(start, end);
  }

  static getAllStudentsOfTeacher({ userId, offset: start, limit, search }) {
    const end = start + limit - 1;
    return this.query()
      .skipUndefined()
      .select(
        'users.id',
        'users.first_name',
        'users.last_name',
        'users.email',
        this.knex().raw(`
          json_agg(distinct jsonb_build_object('id', lessons.id, 'name', lessons.name)) lessons
        `),
        this.knex().raw(`
          json_agg(
          jsonb_build_object(         
          'id', results.id,
          'action', results.action,
          'data', results.data,
          'userId', results.user_id,
          'lessonId', results.lesson_id,
          'blockId', results.block_id,
          'revision', results.revision,
          'correctness', results.correctness,
          'meta', results.meta,
          'createdAt', results.created_at
          )) results
        `),
      )
      .join('lessons', 'lessons.id', '=', 'users_roles.resource_id')
      .join(
        this.knex().raw(`
        users_roles students on students.resource_id = lessons.id
      `),
      )
      .join('users', 'users.id', '=', 'students.user_id')
      .leftJoin(
        this.knex().raw(`
        results on results.user_id = users.id and results.lesson_id = lessons.id
      `),
      )
      .where('users_roles.user_id', userId)
      .andWhere('users_roles.role_id', roles.MAINTAINER.id)
      .andWhere('students.role_id', roles.STUDENT.id)
      .andWhere(
        this.knex().raw(
          `concat(users.email, ' ', users.first_name, ' ', users.last_name, ' ', users.first_name)`,
        ),
        'ilike',
        `%${search ? search.replace(/ /g, '%') : '%'}%`,
      )
      .groupBy('users.id')
      .range(start, end);
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
