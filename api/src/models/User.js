import objection from 'objection';
import path from 'path';

import {
  roles,
  userServiceConstants as constants,
  userServiceErrors as errors,
} from '../config';
import { AuthorizationError, NotFoundError } from '../validation/errors';

import BaseModel from './BaseModel';

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        isSuperAdmin: { type: 'boolean' },
        description: { type: 'string' },
        isConfirmed: { type: 'boolean' },
        language: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static relationMappings() {
    return {
      users_roles: {
        relation: objection.Model.HasManyRelation,
        modelClass: path.join(__dirname, 'UserRole'),
        join: {
          from: 'users.id',
          to: 'users_roles.user_id',
        },
      },
      results: {
        relation: objection.Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Result'),
        join: {
          from: 'users.id',
          to: 'results.userId',
        },
      },
      lessons: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Lesson'),
        join: {
          from: 'users.id',
          through: {
            modelClass: path.join(__dirname, 'UserRole'),
            from: 'users_roles.user_id',
            to: 'users_roles.resource_id',
          },
          to: 'lessons.id',
        },
        modify: (query) => {
          return query.where({
            resource_type: 'lesson',
            role_id: roles.STUDENT.id,
          });
        },
      },
    };
  }

  static createOne({ userData }) {
    return this.query().insert(userData).returning('*');
  }

  static updateOne({ userData, userId }) {
    return this.query()
      .skipUndefined()
      .patch(userData)
      .findById(userId)
      .returning(constants.USER_CONST_ALLOWED_ADMIN_FIELDS)
      .throwIfNotFound({ error: errors.USER_ERR_INVALID_UPDATE });
  }

  static updateLanguage({ userId, language }) {
    return this.query()
      .patch({ language })
      .findById(userId)
      .returning('language');
  }

  static checkIfExist({ id, email }) {
    return this.query()
      .first()
      .skipUndefined()
      .select('id', 'password')
      .where({
        id,
        email,
      })
      .throwIfNotFound({
        error: new AuthorizationError(errors.USER_ERR_UNAUTHORIZED),
      });
  }

  static deleteUser({ userId }) {
    return this.query()
      .deleteById(userId)
      .throwIfNotFound({ error: errors.USER_ERR_USER_NOT_FOUND });
  }

  static getAllUsers({ userId, offset: start, limit, search }) {
    const end = start + limit - 1;

    return this.query()
      .skipUndefined()
      .select(
        constants.USER_CONST_ALLOWED_ADMIN_FIELDS,
        this.knex().raw(`
        (select cast(case when count(*) > 0 then true else false end as bool) 
        from users_roles where users_roles.user_id = users.id and users_roles.role_id = ${roles.TEACHER.id}) is_teacher
      `),
      )
      .whereNot('users.id', userId)
      .search({
        columns: `concat(users.first_name, ' ', users.last_name, ' ', users.first_name, ' ', users.email)`,
        searchString: search,
      })
      .range(start, end);
  }

  static getUser({ userId }) {
    return this.query()
      .findById(userId)
      .select(constants.USER_CONST_ALLOWED_ADMIN_FIELDS)
      .throwIfNotFound({
        error: new NotFoundError(errors.USER_ERR_USER_NOT_FOUND),
      });
  }

  static updateSelf({ userId, user }) {
    return this.query()
      .findById(userId)
      .patch(user)
      .returning('first_name', 'last_name', 'email', 'description');
  }

  static self({ userId }) {
    return this.query()
      .findById(userId)
      .select(
        this.knex().raw(`
          users.id, users.email, users.first_name, users.description, users.last_name, users.language,
          array_remove(array_append(array_agg(distinct roles.name) filter (where roles.name is not null), 
          case when users.is_super_admin then 'SuperAdmin'::varchar end), null) roles
        `),
      )
      .leftJoin('users_roles', 'users_roles.user_id', '=', 'users.id')
      .leftJoin('roles', 'roles.id', '=', 'users_roles.role_id')
      .groupBy('users.id');
  }
}

export default User;
