const options = {
  schema: {
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

async function handler({ params: { courseId }, user: { id: userId } }) {
  const {
    models: { CourseLessonStructure, Course },
  } = this;

  const courseLessons = await CourseLessonStructure.getAllLessons({
    courseId,
    userId,
  });

  const course = await Course.getCourseWithAuthorAndLessons({
    courseId,
    lessons: courseLessons,
  });

  return { total: courseLessons.length, course };
}

export default { options, handler };
