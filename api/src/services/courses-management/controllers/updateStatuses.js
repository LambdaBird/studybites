import { resources, roles, userServiceErrors as errors } from '../../../config';
import { BadRequestError } from '../../../validation/errors';

export const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        courses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              },
              name: {
                type: 'string',
              },
            },
            required: ['id', 'name'],
          },
        },
        status: {
          type: 'string',
          enum: resources.COURSE.status,
        },
      },
      required: ['status', 'courses'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          courses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                },
                name: {
                  type: 'string',
                },
              },
              required: ['id', 'name'],
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
  const updatedCourses = await Course.updateCoursesStatus({ courses, status });
  return { courses: updatedCourses };
}

export default { options, handler };
