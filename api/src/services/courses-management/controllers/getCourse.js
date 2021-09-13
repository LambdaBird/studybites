const options = {
  schema: {
    params: { $ref: 'paramsCourseId#' },
    response: {
      200: {
        type: 'object',
        properties: {
          course: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: ['string', 'null'] },
              status: { type: 'string' },
              image: { type: ['string', 'null'] },
              studentsCount: { type: 'number' },
              author: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
              lessons: { type: 'array' },
            },
          },
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

async function handler({ params: { courseId } }) {
  const {
    models: { Course, CourseLessonStructure, UserRole },
    config: {
      globals: { resources },
    },
  } = this;

  const course = await Course.findById({ courseId });
  const { count: studentsCount } = await UserRole.getResourceStudentsCount({
    resourceId: courseId,
    resourceType: resources.COURSE.name,
  });

  course.studentsCount = studentsCount;
  course.lessons = await CourseLessonStructure.getAllLessons({ courseId });

  return { course };
}

export default { options, handler };
