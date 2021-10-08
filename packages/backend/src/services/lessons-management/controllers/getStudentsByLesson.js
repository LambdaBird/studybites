const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    querystring: { $ref: 'userSearch#' },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          students: { type: 'array' },
        },
      },
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

async function handler({
  user: { id: userId },
  params: { lessonId },
  query: { search, offset, limit },
}) {
  const {
    models: { UserRole },
  } = this;

  const { total, results: students } = await UserRole.getAllStudentsOfResource({
    userId,
    resourceId: lessonId,
    offset,
    limit,
    search,
  });

  return { total, students };
}

export default { options, handler };
