import { resources, roles } from '../../../config';

export const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    body: {
      type: 'object',
      properties: {
        force: {
          type: 'boolean',
          default: false,
        },
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
          update: { type: 'boolean' },
          courses: { type: 'array' },
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

async function handler({ body: { status, force }, params: { lessonId } }) {
  const {
    models: { Course, Lesson },
  } = this;

  const allLessonCourses = await Course.getAllCoursesByLessonId({ lessonId });

  if (status === 'Draft' || status === 'Archived') {
    const nonDraftAndArchivedCourses = allLessonCourses.filter(
      (lessonCourse) => lessonCourse.status !== status,
    );
    if (force) {
      await Course.updateCoursesStatus({
        courses: nonDraftAndArchivedCourses,
        status,
      });
      await Lesson.updateLessonStatus({ lessonId, status });
      return {
        status,
        update: true,
        courses: allLessonCourses,
      };
    }
    if (nonDraftAndArchivedCourses.length > 0) {
      return {
        status,
        update: false,
        courses: allLessonCourses,
      };
    }
  }

  await Lesson.updateLessonStatus({ lessonId, status });
  return {
    status,
    update: true,
    courses: allLessonCourses,
  };
}

export default { options, handler };
