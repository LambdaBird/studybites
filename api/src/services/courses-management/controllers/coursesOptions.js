import { courseSearch, courseStatus } from '../../../validation/schemas';

const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId } }) {
    await this.access({
      userId,
      roleId: this.config.globals.roles.TEACHER.id,
    });
  },
};

async function handler() {
  return {
    GET: {
      querystring: courseSearch,
    },
    POST: {
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
            required: ['name'],
          },
          lessons: { type: 'array', default: [] },
        },
        required: ['course'],
      },
    },
  };
}

export default { options, handler };
