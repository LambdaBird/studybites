const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
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
  return { message: 'Not implemented' };
}

export default { options, handler };
