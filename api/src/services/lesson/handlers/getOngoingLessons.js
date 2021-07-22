import config from '../../../../config';

import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';

export const options = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        search: { type: 'string' },
        offset: { type: 'number', default: 0 },
        limit: { type: 'number', default: config.search.LESSON_SEARCH_LIMIT },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          lessons: { type: 'array' },
        },
      },
      ...errorResponse,
    },
  },
  errorHandler,
  async onRequest(req) {
    await this.auth({ req });
  },
};

export async function handler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    knex,
    models: { Lesson, Result },
  } = this;

  const { excludeLessons } = await Result.query()
    .first()
    .select(knex.raw(`array_agg(lesson_id) as exclude_lessons`))
    .where({ userId })
    .andWhere({ action: 'finish' });

  const { total, results: lessons } = await Lesson.getOngoingLessons({
    knex,
    userId,
    excludeLessons,
    offset,
    limit,
    search,
  }).debug();

  return { total, lessons };
}
