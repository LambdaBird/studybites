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
    response: {
      200: {
        type: 'object',
        properties: {
          lesson: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: ['string', 'null'] },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              maintainers: { type: 'array' },
              blocks: { type: ['array', 'null'] },
            },
          },
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
      roleId: config.roles.STUDENT.id,
    });
  },
};

export async function handler({ params: { lessonId } }) {
  const {
    models: { Lesson },
  } = this;

  const lesson = await Lesson.query()
    .findById(lessonId)
    .withGraphFetched('maintainers');

  return { lesson };
}
