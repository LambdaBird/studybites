import { resources, roles, userServiceErrors as errors } from '../../../config';
import { BadRequestError } from '../../../validation/errors';

export const options = {
  schema: {
    params: { $ref: 'paramsCourseId#' },
    body: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: resources.COURSE.status,
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
            enum: resources.COURSE.status,
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
  async preHandler({ user: { id: userId }, params: { courseId: resourceId } }) {
    await this.access({
      userId,
      resourceId,
      resourceType: resources.COURSE.name,
      roleId: roles.MAINTAINER.id,
    });
  },
};

async function handler({ body: { status }, params: { courseId } }) {
  const {
    models: { Course, Lesson },
  } = this;

  const course = await Course.getCourseWithLessons({ courseId });

  if (status === 'Public') {
    const isCanPublish = !course.lessons?.some(
      (lesson) => lesson.status === 'Archived',
    );
    if (isCanPublish) {
      const draftLessons = course.lessons.filter(
        (lesson) => lesson.status === 'Draft',
      );
      await Lesson.updateLessonsStatus({
        lessons: draftLessons,
        status: 'CourseOnly',
      });

      return Course.updateCourseStatus({ courseId, status });
    }
    throw new BadRequestError(errors.USER_ERR_PUBLISH_RESTRICTED);
  }

  return Course.updateCourseStatus({ courseId, status });
}

export default { options, handler };
