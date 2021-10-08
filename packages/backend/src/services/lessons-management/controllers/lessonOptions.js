import { lessonIdParam, lessonStatus } from '../../../validation/schemas';

const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    const { resources, roles } = this.config.globals;

    await this.access({
      userId,
      resourceId,
      resourceType: resources.LESSON.name,
      roleId: roles.MAINTAINER.id,
    });
  },
};

async function handler() {
  return {
    GET: {
      params: lessonIdParam,
    },
    PUT: {
      params: lessonIdParam,
      body: {
        type: 'object',
        properties: {
          lesson: {
            type: 'object',
            properties: {
              name: { type: 'string', minLength: 1 },
              description: { type: ['string', 'null'] },
              status: lessonStatus,
            },
          },
          blocks: { type: 'array' },
        },
      },
    },
    DELETE: {
      params: lessonIdParam,
    },
  };
}

export default { options, handler };
