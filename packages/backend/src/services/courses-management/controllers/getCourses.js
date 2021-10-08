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
      roleId: this.config.globals.roles.TEACHER.id,
    });
  },
};

async function handler({
  user: { id: userId },
  query: { search, offset, limit, status },
}) {
  const {
    models: { Course },
  } = this;

  const { total, results: courses } = await Course.getAllMaintainableCourses({
    userId,
    offset,
    limit,
    search,
    status,
  });

  return { total, courses };
}

export default { options, handler };
