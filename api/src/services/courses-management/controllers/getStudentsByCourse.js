const options = {
  schema: {
    params: { $ref: 'paramsCourseId#' },
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
  async preHandler({ user: { id: userId }, params: { courseId: resourceId } }) {
    const { resources, roles } = this.config.globals;

    await this.access({
      userId,
      resourceId,
      resourceType: resources.COURSE.name,
      roleId: roles.MAINTAINER.id,
    });
  },
};

async function handler({
  user: { id: userId },
  params: { courseId },
  query: { search, offset, limit },
}) {
  const {
    models: { UserRole },
    config: {
      globals: { resources },
    },
  } = this;

  const { total, results: students } = await UserRole.getAllStudentsOfResource({
    userId,
    resourceId: courseId,
    offset,
    limit,
    search,
    resourceType: resources.COURSE.name,
  });

  return { total, students };
}

export default { options, handler };
