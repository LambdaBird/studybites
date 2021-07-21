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

  const columns = {
    name: 'name',
    firstName: 'maintainer:userInfo.first_name',
    lastName: 'maintainer:userInfo.last_name',
  };

  if (!search) {
    columns.name = undefined;
    columns.firstName = undefined;
    columns.lastName = undefined;
  }

  const firstIndex = parseInt(offset, 10) || 0;
  const lastIndex =
    firstIndex + (parseInt(limit, 10) || config.search.LESSON_SEARCH_LIMIT) - 1;

  const { finishedLessons } = await Result.query()
    .first()
    .select(knex.raw('array_agg(lesson_id) as finished_lessons'))
    .where({
      action: 'finish',
      userId,
    });

  if (finishedLessons === null) {
    return { total: 0, lessons: [] };
  }

  const { total, results } = await Lesson.getAllEnrolled({
    columns,
    userId,
    search: search?.trim(),
  })
    .whereIn('lessons.id', finishedLessons)
    .range(firstIndex, lastIndex);

  const lessons = results?.map((result) => ({
    ...result,
    percentage: 100,
  }));

  return { total, lessons };
}
