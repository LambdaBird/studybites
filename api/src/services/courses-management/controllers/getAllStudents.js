const options = {
  schema: {
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
  async preHandler({ user: { id: userId } }) {
    await this.access({
      userId,
      roleId: this.config.globals.roles.TEACHER.id,
    });
  },
};

async function handler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { UserRole },
  } = this;

  const { total, results: students } =
    await UserRole.getStudentsOfTeacherCourses({
      userId,
      offset,
      limit,
      search,
    });

  return { total, students };
}

export default { options, handler };
