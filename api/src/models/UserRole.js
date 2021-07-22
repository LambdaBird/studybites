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

  static getLessonStudentsCount({ lessonId }) {
    return this.query()
      .where({
        resourceId: lessonId,
        roleId: config.roles.STUDENT.id,
        resourceType: config.resources.LESSON,
      })
      .count()
      .first();
  }
}

export default UserRole;
