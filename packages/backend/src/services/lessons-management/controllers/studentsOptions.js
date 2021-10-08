import { userSearch } from '../../../validation/schemas';

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
      querystring: userSearch,
    },
  };
}

export default { options, handler };
