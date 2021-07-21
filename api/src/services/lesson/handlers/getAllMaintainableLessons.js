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
          data: { type: 'array' },
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
      resourceType: config.resources.LESSON,
      roleId: config.roles.MAINTAINER.id,
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

  const { total, results: data } = await Lesson.getAllMaintainableLessons({
    userId,
    offset,
    limit,
    search,
  });

  return { total, data };
}
