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
  async preHandler({ user: { id: userId } }) {
    await this.access({
      userId,
      roleId: config.roles.TEACHER.id,
    });
  },
};

export async function handler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllMaintainableLessons({
    userId,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}
