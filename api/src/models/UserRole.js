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
      .where('users_roles.resource_type', resources.LESSON.name)
      .andWhere('users_roles.resource_id', lessonId)
      .andWhere('users_roles.role_id', roles.STUDENT.id)
      .groupBy('users.id', 'users_roles.user_id')
      .andWhere(
        this.knex().raw(
          `concat(users.email, ' ', users.first_name, ' ', users.last_name, ' ', users.first_name)`,
        ),
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .range(start, end)
      .withGraphFetched('results')
      .modifyGraph('results', (builder) => {
        builder.where('lessonId', lessonId);
      });
  }

  static getAllStudentsOfTeacher({ userId, offset: start, limit, search }) {
    const end = start + limit - 1;
    return this.query()
      .skipUndefined()
      .select('users.id', 'users.email', 'users.first_name', 'users.last_name')
      .innerJoin(
        'users_roles as T',
        'users_roles.resource_id',
        '=',
        'T.resource_id',
      )
      .innerJoin('users', 'users.id', '=', 'T.user_id')
      .where('users_roles.user_id', userId)
      .andWhere('users_roles.role_id', roles.MAINTAINER.id)
      .andWhere('T.role_id', roles.STUDENT.id)
      .groupBy('users.id')
      .andWhere(
        this.knex().raw(
          `concat(users.email, ' ', users.first_name, ' ', users.last_name, ' ', users.first_name)`,
        ),
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .range(start, end);
  }

  static async addTeacher({ userId }) {
    const checkNotPassed = await this.query().findOne({
      user_id: userId,
      role_id: roles.TEACHER.id,
    });

    if (checkNotPassed) {
      throw new BadRequestError(errors.USER_ERR_FAIL_ALTER_ROLE);
    }

    await this.query()
      .insert({
        user_id: userId,
        role_id: roles.TEACHER.id,
      })
      .returning('*');
  }

  static async removeTeacher({ userId }) {
    const checkPassed = await this.query().findOne({
      user_id: userId,
      role_id: roles.TEACHER.id,
    });

    if (!checkPassed) {
      throw new NotFoundError(errors.USER_ERR_ROLE_NOT_FOUND);
    }

    await this.query().delete().where({
      user_id: userId,
      role_id: roles.TEACHER.id,
    });
  }

  static getLessonStudentsCount({ lessonId }) {
    return this.query()
      .where({
        resource_id: lessonId,
        role_id: roles.STUDENT.id,
        resource_type: resources.LESSON.name,
      })
      .count()
      .first();
  }

  static async addMaintainer({ trx, userId, resourceId }) {
    await this.query(trx)
      .insert({
        user_id: userId,
        resource_id: resourceId,
        role_id: roles.MAINTAINER.id,
        resource_type: resources.LESSON.name,
      })
      .returning('*');
  }

  static enrollToLesson({ userId, lessonId }) {
    return this.query()
      .insert({
        user_id: userId,
        role_id: roles.STUDENT.id,
        resource_type: resources.LESSON.name,
        resource_id: lessonId,
      })
      .returning('*');
  }
}

export default UserRole;
