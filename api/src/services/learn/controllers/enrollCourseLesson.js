const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        lessonId: { type: 'number' },
      },
      required: ['lessonId'],
    },
    params: { $ref: 'paramsCourseId#' },
    response: {
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
      roleId: roles.STUDENT.id,
      status: resources.COURSE.learnStatus,
    });
  },
};

async function handler({
  params: { courseId },
  user: { id: userId },
  body: { lessonId },
}) {
  const {
    models: { CourseLessonStructure, UserRole },
    config: {
      courseService: { courseServiceMessages: messages },
      globals: { resources },
    },
  } = this;

  await CourseLessonStructure.checkIfEnrollAllowed({
    courseId,
    lessonId,
    userId,
  });

  await UserRole.enrollToResource({
    userId,
    resourceId: lessonId,
    resourceType: resources.LESSON.name,
  });
  return { message: messages.COURSE_MSG_SUCCESS_ENROLL };
}

export default { options, handler };
