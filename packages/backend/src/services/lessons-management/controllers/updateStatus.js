import { resources, roles, userServiceErrors as errors } from '../../../config';

export const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    body: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: resources.LESSON.status,
          default: 'Draft',
        },
      },
      required: ['status'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: resources.LESSON.status,
            default: 'Draft',
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
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    await this.access({
      userId,
      resourceId,
      resourceType: resources.LESSON.name,
      roleId: roles.MAINTAINER.id,
    });
  },
};

async function handler({ body: { status }, params: { lessonId } }, reply) {
  const {
    models: { Course, Lesson },
  } = this;

  const allLessonCourses = await Course.getAllCoursesByLessonId({ lessonId });

  if (status === 'Draft' || status === 'Archived') {
    const nonDraftAndArchivedCourses = allLessonCourses.filter(
      (lessonCourse) => lessonCourse.status !== status,
    );
    if (nonDraftAndArchivedCourses.length > 0) {
      return reply.status(400).send({
        statusCode: 400,
        message: errors.USER_ERR_COURSES_RESTRICTED,
        payload: {
          courses: nonDraftAndArchivedCourses,
          status,
        },
      });
    }
  }
  await Lesson.updateLessonStatus({ lessonId, status });
  return {
    status,
  };
}

export default { options, handler };
