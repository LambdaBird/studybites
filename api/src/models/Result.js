import objection from 'objection';
import path from 'path';
import BaseModel from './BaseModel';
import { BadRequestError } from '../validation/errors';

class Result extends BaseModel {
  static get tableName() {
    return 'results';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        action: { type: 'string' },
        data: { type: 'object' },
        userId: { type: 'number' },
        lessonId: { type: 'number' },
        blockId: { type: ['string', 'null'] },
        revision: { type: ['string', 'null'] },
        correctness: { type: 'number' },
        meta: { type: 'object' },
        createdAt: { type: 'string' },
      },
    };
  }

  static relationMappings() {
    return {
      block: {
        relation: objection.Model.HasOneRelation,
        modelClass: path.join(__dirname, 'Block'),
        join: {
          from: 'results.block_id',
          to: 'blocks.block_id',
        },
      },
    };
  }

  static getLastResult({ userId, lessonId }) {
    return this.query()
      .first()
      .where({
        user_id: userId,
        lesson_id: lessonId,
      })
      .orderBy('created_at', 'desc');
  }

  static getFinishedLessons({ userId }) {
    return this.query()
      .first()
      .select(this.knex().raw(`array_agg(lesson_id) as exclude_lessons`))
      .where({ user_id: userId })
      .andWhere({ action: 'finish' });
  }

  static async interactiveBlocksResults({ lessonId, userId }) {
    const results = await Result.query()
      .select('results.data as reply', 'results.block_id', 'results.revision')
      .from(
        this.knex().raw(`
          (select block_id, max(created_at) as created_at from results 
          where lesson_id = ${lessonId} and user_id = ${userId} and data is not null group by block_id) as temp
        `),
      )
      .join(
        this.knex().raw(
          `results on results.block_id = temp.block_id and results.created_at = temp.created_at`,
        ),
      );

    return results.reduce((result, filter) => {
      // eslint-disable-next-line no-param-reassign
      result[filter.blockId] = filter;
      return result;
    }, {});
  }

  static insertOne({
    userId,
    lessonId,
    action,
    blockId,
    revision,
    data,
    correctness,
  }) {
    return this.query().skipUndefined().insert({
      user_id: userId,
      lesson_id: lessonId,
      action,
      block_id: blockId,
      revision,
      data,
      correctness,
    });
  }

  static getIdsOfFinishedLessons({ courseLessons, userId }) {
    return this.query()
      .first()
      .select(this.knex().raw('json_agg(lesson_id) as finished_lessons'))
      .whereIn('lesson_id', courseLessons)
      .where({ user_id: userId, action: 'finish' });
  }

  static async checkNumberOfFinishedLessons({ userId, lessons, error }) {
    const { count } = await this.query()
      .whereIn('lesson_id', lessons)
      .where({ user_id: userId, action: 'finish' })
      .first()
      .count();

    if (+count !== lessons.length) {
      throw new BadRequestError(error);
    }
  }

  static setCorrectness({ resultId, correctness, meta }) {
    return this.query().findById(resultId).patch({ correctness, meta });
  }
}

export default Result;
