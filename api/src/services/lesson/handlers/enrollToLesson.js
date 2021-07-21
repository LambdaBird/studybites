import config from '../../../../config';

import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';
import { BadRequestError } from '../../../validation/errors';

import { ENROLL_SUCCESS, INVALID_ENROLL } from '../constants';

export const options = {
  schema: {
    params: {
      type: 'object',
      properties: {
        lessonId: { type: 'number' },
      },
      required: ['lessonId'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          message: { type: 'string' },
        },
      },
      ...errorResponse,
    },
  },
  errorHandler,
  async onRequest(req) {
    await this.auth({ req });
  },
};

export async function handler({ user: { id: userId }, params: { lessonId } }) {
  const {
    models: { Lesson, UserRole },
  } = this;

  const lesson = await Lesson.query()
    .findById(lessonId)
    .where({ status: 'Public' })
    .whereNotExists(
      UserRole.query().select().where({
        userId,
        roleId: config.roles.STUDENT.id,
        resourceType: config.resources.LESSON,
        resourceId: lessonId,
      }),
    );

  if (!lesson) {
    throw new BadRequestError(INVALID_ENROLL);
  }

  await UserRole.query()
    .insert({
      userId,
      roleId: config.roles.STUDENT.id,
      resourceType: config.resources.LESSON,
      resourceId: lesson.id,
    })
    .returning('*');

  return ENROLL_SUCCESS;
}
