import config from '../../../../config';

import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';

export const options = {
  schema: {
    params: {
      type: 'object',
      properties: {
        lessonId: { type: 'number' },
      },
      required: ['lessonId'],
    },
    querystring: {
      type: 'object',
      properties: {
        search: { type: 'string' },
        offset: { type: 'number', default: 0 },
        limit: { type: 'number', default: config.search.USER_SEARCH_LIMIT },
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
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    await this.access({
      userId,
      resourceId,
      resourceType: config.resources.LESSON,
      roleId: config.roles.MAINTAINER.id,
    });
  },
};

export async function handler({
  params: { lessonId: resourceId },
  query: { search, offset, limit },
}) {
  const {
    models: { UserRole },
  } = this;

  const columns = {
    email: 'email',
    firstName: 'firstName',
  };

  if (!search) {
    columns.email = undefined;
    columns.firstName = undefined;
  }

  const data = await UserRole.relatedQuery('users')
    .skipUndefined()
    .for(
      UserRole.query().select('user_id').where({
        roleId: config.roles.STUDENT.id,
        resourceId,
      }),
    )
    .select('id', 'email', 'firstName', 'lastName')
    .where(columns.email, 'ilike', `%${search}%`)
    .orWhere(columns.firstName, 'ilike', `%${search}%`)
    .offset(offset || 0)
    .limit(limit || config.search.USER_SEARCH_LIMIT);

  const count = await UserRole.relatedQuery('users')
    .skipUndefined()
    .for(
      UserRole.query().select('user_id').where({
        roleId: config.roles.STUDENT.id,
        resourceId,
      }),
    )
    .where(columns.email, 'ilike', `%${search}%`)
    .orWhere(columns.firstName, 'ilike', `%${search}%`)
    .count('*');

  return { total: +count[0].count, data };
}
