import config from '../../../../../config';

import errorResponse from '../../../../validation/schemas';
import errorHandler from '../../../../validation/errorHandler';

export const learnLessonOptions = {
  schema: {
    params: {
      type: 'object',
      properties: {
        lessonId: { type: 'number' },
      },
      required: ['lessonId'],
    },
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        action: { type: 'string' },
        blockId: { type: 'string' },
        revision: { type: 'string' },
        data: {
          type: 'object',
          additionalProperties: false,
          properties: {
            question: { type: 'string' },
            answers: { type: 'array' },
            response: { type: 'array' },
            isSolved: { type: 'boolean' },
          },
          oneOf: [
            {
              required: ['answers'],
            },
            {
              required: ['isSolved'],
            },
          ],
        },
      },
      if: {
        properties: {
          action: { enum: ['start', 'finish'] },
        },
      },
      then: {
        properties: {
          blockId: { type: 'null', const: null },
          revision: { type: 'null', const: null },
          data: { type: 'null', const: null },
        },
        required: ['action'],
      },
      else: {
        required: ['action', 'blockId', 'revision', 'data'],
      },
    },
    response: {
      ...errorResponse,
    },
  },
  errorHandler,
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    await this.access({
      userId,
      resourceId,
      resourceType: config.resources.LESSON,
      roleId: config.roles.STUDENT.id,
      status: ['Public', 'Draft'],
    });
  },
};
