import { lessonSearch, lessonStatus } from '../../../validation/schemas';

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
      querystring: lessonSearch,
    },
    POST: {
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
            required: ['name'],
          },
          blocks: { type: 'array', default: [] },
        },
        required: ['lesson'],
      },
    },
  };
}

export default { options, handler };
