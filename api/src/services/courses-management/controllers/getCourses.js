const options = {
  schema: {
    querystring: { $ref: 'courseSearch#' },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          courses: { type: 'array' },
        },
      },
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId } }) {
    await this.access({
      userId,
      roleId: this.config.globals.roles.MAINTAINER.id,
    });
  },
};

async function handler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { Course },
  } = this;

  const { total, results: lessons } = await Course.getAllMaintainableCourses({
    userId,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}

export default { options, handler };
