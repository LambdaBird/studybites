const options = {
  schema: {
    params: { $ref: 'paramsCourseId#' },
    response: {
      200: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          message: { type: 'string' },
        },
      },
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler({ user: { id: userId }, params: { courseId } }) {
  const {
    config: {
      courseService: { courseServiceMessages: messages },
      globals: { resources },
    },
    models: { UserRole },
  } = this;

  await UserRole.enrollToResource({
    userId,
    resourceId: courseId,
    resourceType: resources.COURSE.name,
    resourceStatuses: resources.COURSE.enrollStatuses,
  });

  return { message: messages.COURSE_MSG_SUCCESS_ENROLL };
}

export default { options, handler };
