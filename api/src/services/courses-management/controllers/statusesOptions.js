import { resources, roles } from '../../../config';
import { options as updateOptions } from './updateStatuses';

const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId }, body: { courses } }) {
    await this.access({
      userId,
      resourceType: resources.COURSE.name,
      roleId: roles.MAINTAINER.id,
      resourcesId: courses.map((course) => course.id),
    });
  },
};

async function handler() {
  return {
    POST: {
      body: updateOptions.schema.body,
    },
  };
}

export default { options, handler };
