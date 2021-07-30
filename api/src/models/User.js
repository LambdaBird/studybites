import objection from 'objection';
import path from 'path';

import {
  userServiceErrors as errors,
  userServiceConstants as constants,
  roles,
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
      .andWhere(
        this.knex().raw(
          `concat(users.first_name, ' ', users.last_name, ' ', users.first_name, ' ', users.email)`,
        ),
        'ilike',
        `%${search ? search.replace(/ /g, '%') : '%'}%`,
      )
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

  static self({ userId }) {
    return this.query()
      .findById(userId)
      .select(
        this.knex().raw(`
          users.id, users.email, users.first_name, users.last_name,
          array_remove(array_append(array_agg(distinct roles.name) filter (where roles.name is not null), 
          case when users.is_super_admin then 'SuperAdmin'::varchar end), null) roles
        `),
      )
      .leftJoin('users_roles', 'users_roles.userId', '=', 'users.id')
      .leftJoin('roles', 'roles.id', '=', 'users_roles.roleId')
      .groupBy('users.id');
  }
}

export default User;
