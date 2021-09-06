import { v4 } from 'uuid';

const options = {
  schema: {
    params: { $ref: 'paramsCourseId#' },
    body: {
      type: 'object',
      properties: {
        course: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: ['string', 'null'] },
            status: { $ref: 'courseStatus#' },
          },
        },
        lessons: { type: 'array' },
      },
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
              lessons: { type: ['array', 'null'] },
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

async function handler({ body: { course, lessons }, params: { courseId } }) {
  const {
    models: { Course, CourseLessonStructure },
  } = this;

  try {
    const data = await Course.transaction(async (trx) => {
      let courseData;

      if (course) {
        courseData = await Course.updateCourse({ trx, courseId, course });
      } else {
        courseData = await Course.query(trx).findById(courseId);
      }

      if (lessons) {
        await CourseLessonStructure.insertLessons({
          trx,
          lessons,
          courseId: courseData.id,
          update: true,
        });
      }

      courseData.lessons = await CourseLessonStructure.getAllLessons({
        trx,
        courseId: courseData.id,
      });

      return courseData;
    });

    return { course: data };
  } catch (err) {
    throw new Error(err);
  }
}

export default { options, handler };
