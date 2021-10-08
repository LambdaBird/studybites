import { lessonIdParam } from '../../../validation/schemas';
import learnLesson from './learnLesson';

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
      status: resources.LESSON.learnStatus,
    });
  },
};

async function handler() {
  return {
    POST: {
      params: lessonIdParam,
      body: learnLesson.options.schema.body,
    },
  };
}

export default { options, handler };
