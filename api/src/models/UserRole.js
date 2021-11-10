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
          from: 'users_roles.user_id',
          to: 'results.user_id',
        },
      },
    };
  }

  static getAllStudentsOfResource({
    resourceId,
    offset: start,
    limit,
    search,
    resourceType = resources.LESSON.name,
  }) {
    const end = start + limit - 1;

    const query = this.query()
      .skipUndefined()
      .select('users.id', 'users.email', 'users.first_name', 'users.last_name')
      .join('users', (builder) =>
        builder
          .on('users_roles.user_id', '=', 'users.id')
          .andOn('users_roles.role_id', '=', roles.STUDENT.id)
          .andOn(
            'users_roles.resource_type',
            '=',
            this.knex().raw('?', [resourceType]),
          ),
      )
      .where('users_roles.resource_id', resourceId)
      .groupBy('users.id', 'users_roles.user_id')
      .search({
        columns: [
          'users.first_name',
          'users.last_name',
          'users.first_name',
          'users.email',
        ],
        searchString: search,
      })
      .range(start, end);

    if (resourceType === resources.LESSON.name) {
      return query
        .withGraphFetched('results')
        .modifyGraph('results', (builder) => {
          builder.where('lesson_id', resourceId);
          builder.withGraphFetched('block');
          builder.orderBy('created_at');
        });
    }
    return query;
  }

  static getStudentsOfTeacherLessons({ userId, offset: start, limit, search }) {
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
        this.knex().raw(`MAX(results.created_at) as last_activity`),
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
      .andWhere('users_roles.resource_type', resources.LESSON.name)
      .andWhere('students.role_id', roles.STUDENT.id)
      .search({
        columns: [
          'users.first_name',
          'users.last_name',
          'users.first_name',
          'users.email',
        ],
        searchString: search,
      })
      .groupBy('users.id')
      .range(start, end);
  }

  static getStudentsOfTeacherCourses({ userId, offset: start, limit, search }) {
    const end = start + limit - 1;

    return this.query()
      .skipUndefined()
      .select(
        'users.id',
        'users.first_name',
        'users.last_name',
        'users.email',
        this.knex().raw(`
          json_agg(distinct jsonb_build_object('id', courses.id, 'name', courses.name)) courses
        `),
      )
      .join('courses', 'courses.id', '=', 'users_roles.resource_id')
      .join(
        this.knex().raw(`
        users_roles students on students.resource_id = courses.id
      `),
      )
      .join('users', 'users.id', '=', 'students.user_id')
      .where('users_roles.user_id', userId)
      .andWhere('users_roles.role_id', roles.MAINTAINER.id)
      .andWhere('users_roles.resource_type', resources.COURSE.name)
      .andWhere('students.role_id', roles.STUDENT.id)
      .search({
        columns: [
          'users.first_name',
          'users.last_name',
          'users.first_name',
          'users.email',
        ],
        searchString: search,
      })
      .groupBy('users.id')
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

  static getResourceStudentsCount({ resourceId, resourceType }) {
    return this.query()
      .where({
        resource_id: resourceId,
        role_id: roles.STUDENT.id,
        resource_type: resourceType,
      })
      .count()
      .first();
  }

  static async addMaintainer({
    trx,
    userId,
    resourceId,
    resourceType = resources.LESSON.name,
  }) {
    await this.query(trx)
      .insert({
        user_id: userId,
        resource_id: resourceId,
        role_id: roles.MAINTAINER.id,
        resource_type: resourceType,
      })
      .returning('*');
  }

  static async enrollToResource({
    userId,
    resourceId,
    resourceType,
    resourceStatuses,
  }) {
    await this.query()
      .findById(resourceId)
      .from(resourceType === resources.COURSE.name ? 'courses' : 'lessons')
      .whereIn('status', resourceStatuses)
      .whereNotIn(
        'id',
        this.knex().raw(`
            select resource_id
            from users_roles
            where user_id = ${userId}
              and role_id = ${roles.STUDENT.id}
              and resource_type = '${resourceType}'
        `),
      )
      .throwIfNotFound({
        error: new BadRequestError('errors.fail_enroll'),
      });

    await this.query()
      .insert({
        user_id: userId,
        role_id: roles.STUDENT.id,
        resource_type: resourceType,
        resource_id: resourceId,
      })
      .returning('*');
  }

  static getAllAuthors({ offset: start, limit, search }) {
    const end = start + limit - 1;

    return this.query()
      .select('users.id', 'users.first_name', 'users.last_name')
      .skipUndefined()
      .where({
        role_id: roles.TEACHER.id,
      })
      .join('users', 'users.id', '=', 'users_roles.user_id')
      .search({
        columns: [
          'users.first_name',
          'users.last_name',
          'users.first_name',
          'users.email',
        ],
        searchString: search,
      })
      .range(start, end);
  }
}

export default UserRole;
