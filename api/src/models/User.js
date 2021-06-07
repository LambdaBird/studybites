/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-cycle */
import objection from 'objection';

import config from '../../config';

import UserRole from './UserRole';

class UserQueryBuilder extends objection.QueryBuilder {
  getAll(columns, req) {
    this.skipUndefined()
      .select([
        'id',
        'email',
        'firstName',
        'lastName',
        'isConfirmed',
        'isSuperAdmin',
      ])
      .where(columns.email, 'ilike', `%${req.query.search}%`)
      .orWhere(columns.firstName, 'ilike', `%${req.query.search}%`)
      .whereNot({
        id: req.user.id,
      })
      .where(columns.email, 'ilike', `%${req.query.search}%`)
      .orWhere(columns.firstName, 'ilike', `%${req.query.search}%`)
      .orWhere(columns.lastName, 'ilike', `%${req.query.search}%`)
      .offset(req.query.offset || 0)
      .limit(req.query.limit || config.search.USER_SEARCH_LIMIT);

    return this;
  }

  countAll(columns, req) {
    this.skipUndefined()
      .whereNot({
        id: req.user.id,
      })
      .where(columns.email, 'ilike', `%${req.query.search}%`)
      .orWhere(columns.firstName, 'ilike', `%${req.query.search}%`)
      .orWhere(columns.lastName, 'ilike', `%${req.query.search}%`)
      .count('*');

    return this;
  }
}

class User extends objection.Model {
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

  static get QueryBuilder() {
    return UserQueryBuilder;
  }

  static relationMappings() {
    return {
      users_roles: {
        relation: objection.Model.HasManyRelation,
        modelClass: UserRole,
        join: {
          from: 'users.id',
          to: 'users_roles.user_id',
        },
      },
    };
  }
}

export default User;
