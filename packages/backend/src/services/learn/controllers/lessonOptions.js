import { lessonIdParam } from '../../../validation/schemas';

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
      roleId: roles.STUDENT.id,
    });
  },
};

async function handler() {
  return {
    GET: {
      params: lessonIdParam,
    },
  };
}

export default { options, handler };
