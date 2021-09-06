import { courseIdParam, courseStatus } from '../../../validation/schemas';

const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId }, params: { courseId: resourceId } }) {
    const { resources, roles } = this.config.globals;

    await this.access({
      userId,
      resourceId,
      resourceType: resources.COURSE.name,
      roleId: roles.MAINTAINER.id,
    });
  },
};

async function handler() {
  return {
    GET: {
      params: courseIdParam,
    },
    PUT: {
      params: courseIdParam,
      body: {
        type: 'object',
        properties: {
          course: {
            type: 'object',
            properties: {
              name: { type: 'string', minLength: 1 },
              description: { type: ['string', 'null'] },
              status: courseStatus,
            },
          },
          lessons: { type: 'array' },
        },
      },
    },
    DELETE: {
      params: courseIdParam,
    },
  };
}

export default { options, handler };
