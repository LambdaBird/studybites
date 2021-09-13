import objection from 'objection';
import path from 'path';

import { BadRequestError, NotFoundError } from '../validation/errors';
import {
  lessonServiceErrors as errors,
  roles,
  resources,
  blockConstants,
} from '../config';

import BaseModel from './BaseModel';

class Lesson extends BaseModel {
  static get tableName() {
    return 'lessons';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string' },
        status: {
          type: 'string',
          enum: resources.LESSON.status,
          default: 'Draft',
        },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static relationMappings() {
    return {
      courses: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Course'),
        join: {
          from: 'lessons.id',
          through: {
            modelClass: path.join(__dirname, 'CourseLessonStructure'),
            from: 'course_lesson_structure.lesson_id',
            to: 'course_lesson_structure.course_id',
          },
          to: 'courses.id',
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
              resource_type: 'lesson',
              role_id: roles.STUDENT.id,
            })
            .select('id', 'first_name', 'last_name');
        },
      },

      maintainer: {
        relation: objection.Model.HasOneRelation,
        modelClass: path.join(__dirname, 'UserRole'),
        join: {
          from: 'lessons.id',
          to: 'users_roles.resource_id',
        },
      },

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
              resource_type: resources.LESSON.name,
            })
            .select('id', 'first_name', 'last_name');
        },
      },

      keywords: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Keyword'),
        join: {
          from: 'lessons.id',
          through: {
            modelClass: path.join(__dirname, 'ResourceKeyword'),
            from: 'resource_keywords.resource_id',
            to: 'resource_keywords.keyword_id',
          },
          to: 'keywords.id',
        },
        modify: (query) => {
          return query.where({ resource_type: resources.LESSON.name });
        },
      },

      blocksRevisions: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Block'),
        join: {
          from: 'lessons.id',
          through: {
            modelClass: path.join(__dirname, 'LessonBlockStructure'),
            from: 'lesson_block_structure.lesson_id',
            to: 'lesson_block_structure.block_id',
          },
          to: 'blocks.block_id',
        },
      },

      blocks: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Block'),
        join: {
          from: 'lessons.id',
          through: {
            modelClass: path.join(__dirname, 'LessonBlockStructure'),
            from: 'lesson_block_structure.lesson_id',
            to: 'lesson_block_structure.block_id',
          },
          to: 'blocks.block_id',
        },
        modify: (query) => {
          return query
            .select('b.*')
            .from(
              objection.raw(
                `(select block_id, MAX(created_at) as created_at from blocks group by block_id) as blocks`,
              ),
            )
            .join(
              objection.raw(
                `blocks as b on b.block_id = blocks.block_id and b.created_at = blocks.created_at`,
              ),
            );
        },
      },

      lessonBlocks: {
        relation: objection.Model.HasOneRelation,
        modelClass: path.join(__dirname, 'LessonBlockStructure'),
        join: {
          from: 'lessons.id',
          to: 'lesson_block_structure.lesson_id',
        },
        modify: (query) => {
          return query.select('blocks');
        },
      },
    };
  }

  static findById({ lessonId }) {
    return this.query()
      .findById(lessonId)
      .throwIfNotFound({
        error: new NotFoundError(errors.LESSON_ERR_LESSON_NOT_FOUND),
      });
  }

  static checkIfEnrolled({ lessonId, userId }) {
    return this.query()
      .findById(lessonId)
      .where({ status: 'Public' })
      .whereNotIn(
        'id',
        this.knex().raw(`
          select resource_id from users_roles 
          where user_id = ${userId} and role_id = ${roles.STUDENT.id}
        `),
      )
      .throwIfNotFound({
        error: new BadRequestError(errors.LESSON_ERR_FAIL_ENROLL),
      });
  }

  /**
   * get all lessons where status = 'Public' with author,
   * search, pagination and total
   */
  static getAllPublicLessons({
    userId,
    offset: start,
    limit,
    search,
    tags,
    authors,
  }) {
    const end = start + limit - 1;

    const query = this.query()
      .skipUndefined()
      .select(
        'lessons.*',
        this.knex().raw(`        
          (select cast(case when count(*) > 0 then true else false end as bool)
           from users_roles
           where role_id = ${roles.STUDENT.id}
             and user_id = ${userId}
             and resource_type = '${resources.LESSON.name}'
             and resource_id = lessons.id) is_enrolled
        `),
      )
      .join('users_roles', (builder) =>
        builder
          .on('users_roles.resource_id', '=', 'lessons.id')
          .andOn('users_roles.role_id', '=', roles.MAINTAINER.id)
          .andOn(
            'users_roles.resource_type',
            '=',
            this.knex().raw('?', [resources.LESSON.name]),
          ),
      )
      .joinRaw(
        `left join resource_keywords on lessons.id = resource_keywords.resource_id 
        and resource_keywords.resource_type = '${resources.LESSON.name}'`,
      )
      .whereIn('users_roles.user_id', authors)
      .andWhere('lessons.status', 'Public')
      .andWhere(
        'lessons.name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .whereNotIn(
        'lessons.id',
        this.knex().raw(
          `select lesson_id from results where user_id = ${userId} and action = '${blockConstants.actions.FINISH}'`,
        ),
      )
      .groupBy('lessons.id')
      .withGraphFetched('author')
      .withGraphFetched('keywords')
      .range(start, end);

    if (tags) {
      return query
        .whereIn('resource_keywords.keyword_id', tags)
        .havingRaw('count(resource_keywords.keyword_id) = ?', [tags.length]);
    }
    return query;
  }

  static createLesson({ trx, lesson }) {
    return this.query(trx).insert(lesson).returning('*');
  }

  static getLessonWithAuthor({ lessonId }) {
    return this.query().findById(lessonId).withGraphFetched('author');
  }

  static getLessonWithProgress({ lessonId }) {
    return this.query()
      .select(
        'lessons.*',
        this.knex().raw(`
          (select count(*) from results where lesson_id = lessons.id and action in ('next', 'response')) interactive_passed
        `),
        this.knex().raw(`
          (select count(*) from lesson_block_structure join blocks on blocks.block_id = lesson_block_structure.block_id
          where blocks.type in ('next', 'quiz') and lesson_block_structure.lesson_id = lessons.id) interactive_total
        `),
      )
      .findById(lessonId)
      .withGraphFetched('author');
  }

  static updateLessonStatus({ lessonId, status }) {
    return this.query().findById(lessonId).patch({ status }).returning('*');
  }

  static getAllFinishedLessons({
    userId,
    offset: start,
    limit,
    search,
    tags,
    authors,
  }) {
    const end = start + limit - 1;

    const query = this.query()
      .skipUndefined()
      .select(
        'lessons.*',
        this.knex().raw(`true is_finished`),
        this.knex().raw(`
          (select count(*) from results where lesson_id = lessons.id and action in ('next', 'response')) interactive_passed
        `),
        this.knex().raw(`
          (select count(*) from lesson_block_structure join blocks on blocks.block_id = lesson_block_structure.block_id
          where blocks.type in ('next', 'quiz') and lesson_block_structure.lesson_id = lessons.id) interactive_total
        `),
      )
      .join(
        this.knex().raw('users_roles authors'),
        'authors.resource_id',
        '=',
        'lessons.id',
      )
      .join(
        this.knex().raw('users_roles learn'),
        'learn.resource_id',
        '=',
        'lessons.id',
      )
      .join('results', 'results.lesson_id', '=', 'lessons.id')
      .joinRaw(
        `left join resource_keywords on lessons.id = resource_keywords.resource_id 
        and resource_keywords.resource_type = '${resources.LESSON.name}'`,
      )
      .whereIn('authors.user_id', authors)
      .where('authors.role_id', roles.MAINTAINER.id)
      .andWhere('learn.role_id', roles.STUDENT.id)
      .andWhere('learn.user_id', userId)
      .andWhere('results.action', 'finish')
      .andWhere('results.user_id', userId)
      .andWhere(
        'lessons.name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .groupBy('lessons.id')
      .range(start, end)
      .withGraphFetched('author')
      .withGraphFetched('keywords');

    if (tags) {
      return query
        .whereIn('resource_keywords.keyword_id', tags)
        .havingRaw('count(resource_keywords.keyword_id) = ?', [tags.length]);
    }
    return query;
  }

  static updateLesson({ trx, lessonId, lesson }) {
    return this.query(trx).findById(lessonId).patch(lesson).returning('*');
  }

  /**
   * get all lessons that teacher is maintaining
   * with search, pagination and total
   */
  static getAllMaintainableLessons({
    userId,
    offset: start,
    limit,
    search,
    tags,
  }) {
    const end = start + limit - 1;

    const query = this.query()
      .skipUndefined()
      .join('users_roles', 'users_roles.resource_id', '=', 'lessons.id')
      .joinRaw(
        `left join resource_keywords on lessons.id = resource_keywords.resource_id 
        and resource_keywords.resource_type = '${resources.LESSON.name}'`,
      )
      .where('users_roles.role_id', roles.MAINTAINER.id)
      .andWhere('users_roles.resource_type', resources.LESSON.name)
      .andWhere('users_roles.user_id', userId)
      .andWhere(
        'lessons.name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .orderBy('lessons.created_at', 'desc')
      .groupBy('lessons.id')
      .range(start, end)
      .withGraphFetched('students')
      .withGraphFetched('keywords')
      .withGraphFetched('courses');

    if (tags) {
      return query
        .whereIn('resource_keywords.keyword_id', tags)
        .havingRaw('count(resource_keywords.keyword_id) = ?', [tags.length]);
    }
    return query;
  }

  /**
   * get all lessons user had enrolled to
   */
  static getOngoingLessons({
    userId,
    offset: start,
    limit,
    search,
    excludeLessons,
    tags,
    authors,
  }) {
    const end = start + limit - 1;

    const query = this.query()
      .skipUndefined()
      .select(
        'lessons.*',
        this.knex().raw(`
          (select count(*) from results where lesson_id = lessons.id and action in ('next', 'response')) interactive_passed
        `),
        this.knex().raw(`
          (select count(*) from lesson_block_structure join blocks on blocks.block_id = lesson_block_structure.block_id
          where blocks.type in ('next', 'quiz') and lesson_block_structure.lesson_id = lessons.id) interactive_total
        `),
        this.knex().raw(`
          (select cast(case when count(*) > 0 then true else false end as bool) from results
          where lesson_id = lessons.id and action = 'start' and user_id = ${userId}) is_started
        `),
      )
      .join('users_roles', 'users_roles.resource_id', '=', 'lessons.id')
      .where('users_roles.role_id', roles.MAINTAINER.id)
      .join(
        this.knex().raw('users_roles enrolled'),
        'enrolled.resource_id',
        '=',
        'lessons.id',
      )
      .joinRaw(
        `left join resource_keywords on lessons.id = resource_keywords.resource_id 
        and resource_keywords.resource_type = '${resources.LESSON.name}'`,
      )
      .where('lessons.status', 'Public')
      .andWhere('enrolled.role_id', roles.STUDENT.id)
      .andWhere('enrolled.user_id', userId)
      .andWhere('users_roles.resource_type', resources.LESSON.name)
      .whereNotIn('lessons.id', excludeLessons || undefined)
      .whereIn('users_roles.user_id', authors)
      .andWhere(
        'lessons.name',
        'ilike',
        search ? `%${search.replace(/ /g, '%')}%` : undefined,
      )
      .whereNotIn(
        'lessons.id',
        this.knex().raw(
          `select lesson_id from results where user_id = ${userId} and action = '${blockConstants.actions.FINISH}'`,
        ),
      )
      .groupBy('lessons.id')
      .range(start, end)
      .withGraphFetched('author')
      .withGraphFetched('keywords');

    if (tags) {
      return query
        .whereIn('resource_keywords.keyword_id', tags)
        .havingRaw('count(resource_keywords.keyword_id) = ?', [tags.length]);
    }
    return query;
  }
}

export default Lesson;
