import { courseIdParam } from '../../../validation/schemas';
import enrollCourseLesson from './enrollCourseLesson';

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
      roleId: roles.STUDENT.id,
      status: resources.COURSE.learnStatus,
    });
  },
};

async function handler() {
  return {
    POST: {
      params: courseIdParam,
      body: enrollCourseLesson.options.schema.body,
    },
  };
}

export default { options, handler };
