import objection from 'objection';
import path from 'path';
import config from '../../config';

class UserRole extends objection.Model {
  static get tableName() {
    return 'users_roles';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        userID: { type: 'integer' },
        roleID: { type: 'integer' },
        resourceType: { type: 'string' },
        resourceID: { type: 'integer' },
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

  static getAllTeacherStudents({ columns, search, userId }) {
    return this.query()
      .skipUndefined()
      .select('users.id', 'users.email', 'users.first_name', 'users.last_name')
      .innerJoin('users_roles as students', (builder) => {
        builder
          .on(
            'students.role_id',
            '=',
            objection.raw('?', [config.roles.STUDENT.id]),
          )
          .andOn('users_roles.user_id', '=', objection.raw('?', [userId]))
          .andOn(
            'users_roles.role_id',
            '=',
            objection.raw('?', [config.roles.MAINTAINER.id]),
          )
          .andOn(
            'users_roles.resource_type',
            '=',
            objection.raw('?', [config.resources.LESSON]),
          );
      })
      .innerJoin('users', (builder) => {
        builder.on('users.id', '=', 'students.user_id');
      })
      .where(function () {
        this.skipUndefined()
          .where(columns.email, 'ilike', `%${search}%`)
          .orWhere(columns.firstName, 'ilike', `%${search}%`)
          .orWhere(columns.lastName, 'ilike', `%${search}%`);
      })
      .groupBy('users.id');
  }
}

export default UserRole;
