import config from '../../../../config';

import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';

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
          total: { type: 'number' },
          lesson: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: ['string', 'null'] },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              authors: { type: 'array' },
              blocks: { type: 'array' },
            },
          },
          isFinal: { type: 'boolean' },
        },
        required: ['total', 'lesson', 'isFinal'],
      },
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
    });
  },
};

export async function handler({ user: { id: userId }, params: { lessonId } }) {
  const {
    models: { Lesson, Result, LessonBlockStructure },
  } = this;
  /**
   * get lesson
   */
  const lesson = await Lesson.query()
    .first()
    .where({ id: lessonId })
    .withGraphFetched('authors');
  /**
   * get last record from the results table
   */
  const lastResult = await Result.getLastResult({ userId, lessonId });
  /**
   * if the lesson was not started yet
   */
  if (!lastResult) {
    lesson.blocks = [];
    return { total: 0, lesson, isFinal: false };
  }
  /**
   * if the lesson was finished
   */
  if (lastResult.action === 'finish') {
    const blocks = await LessonBlockStructure.getAllBlocks({ lessonId });
    lesson.blocks = blocks;
    return {
      total: blocks.length,
      lesson,
      isFinished: true,
    };
  }
  /**
   * else
   */
  const { total, chunk, isFinal } = await LessonBlockStructure.getChunk({
    lessonId,
    previousBlock: lastResult.blockId,
    fromStart: true,
  });
  lesson.blocks = chunk;
  return { total, lesson, isFinal };
}
