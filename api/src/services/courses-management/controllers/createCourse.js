const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        course: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: ['string', 'null'] },
            status: { $ref: 'courseStatus#' },
            image: { type: ['string', 'null'] },
          },
          required: ['name'],
        },
        lessons: { type: 'array', default: [] },
      },
      required: ['course'],
    },
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
  async preHandler({ user: { id: userId } }) {
    await this.access({
      userId,
      roleId: this.config.globals.roles.TEACHER.id,
    });
  },
};

async function handler({ body: { course, lessons }, user: { id: userId } }) {
  const {
    models: { Course, UserRole, CourseLessonStructure },
    config: {
      globals: { resources },
    },
  } = this;

  try {
    const data = await Course.transaction(async (trx) => {
      const courseData = await Course.createCourse({ trx, course });
      await UserRole.addMaintainer({
        trx,
        userId,
        resourceId: courseData.id,
        resourceType: resources.COURSE.name,
      });

      if (lessons) {
        await CourseLessonStructure.insertLessons({
          trx,
          lessons,
          courseId: courseData.id,
        });
      }

      courseData.lessons = await CourseLessonStructure.getAllLessons({
        trx,
        courseId: courseData.id,
      });

      return courseData;
    });

    return { course: data };
  } catch (error) {
    throw new Error(error);
  }
}

export default { options, handler };
