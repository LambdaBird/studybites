import { resources, roles, userServiceErrors as errors } from '../../../config';
import { BadRequestError } from '../../../validation/errors';

export const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        courses: {
          type: 'array',
        },
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
  async preHandler({ user: { id: userId }, body: { courses } }) {
    await this.access({
      userId,
      resourceType: resources.COURSE.name,
      roleId: roles.MAINTAINER.id,
      resourcesId: courses.map((course) => course.id),
    });
  },
};

async function handler({ body: { status, courses } }) {
  const {
    models: { Course },
  } = this;

  if (status !== 'Draft' && status !== 'Archived') {
    throw new BadRequestError(errors.USER_ERR_PUBLISH_RESTRICTED);
  }

  return Course.updateCoursesStatus({ courses, status });
}

export default { options, handler };
