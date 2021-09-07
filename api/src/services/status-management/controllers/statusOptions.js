import { resources } from '../../../config';

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
    POST: {
      body: {
        type: 'object',
        properties: {
          status: resources.LESSON.status,
        },
        required: ['status'],
      },
    },
  };
}

export default { options, handler };
