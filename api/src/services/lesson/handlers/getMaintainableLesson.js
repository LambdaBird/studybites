import config from '../../../../config';

import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';
import { NotFoundError } from '../../../validation/errors';

import { NOT_FOUND } from '../constants';

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
        },
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
      roleId: config.roles.MAINTAINER.id,
    });
  },
};

export async function handler({ params: { lessonId } }) {
  const {
    models: { Lesson, LessonBlockStructure },
  } = this;

  const lesson = await Lesson.query()
    .findById(lessonId)
    .withGraphFetched('blocks');

  if (!lesson) {
    throw new NotFoundError(NOT_FOUND);
  }

  try {
    const { parent } = await LessonBlockStructure.query()
      .first()
      .select('id as parent')
      .where({ lessonId })
      .whereNull('parentId');

    const { rows: blocksOrder } = await LessonBlockStructure.knex().raw(
      `select lesson_block_structure.block_id from connectby('lesson_block_structure', 'id', 'parent_id', '${parent}', 0, '~') 
          as temporary(id uuid, parent_id uuid, level int, branch text) join lesson_block_structure on temporary.id = lesson_block_structure.id`,
    );

    const blocks = [];

    const dictionary = lesson.blocks.reduce((result, filter) => {
      // eslint-disable-next-line no-param-reassign
      result[filter.blockId] = filter;
      return result;
    }, {});

    blocksOrder.map((block) => blocks.push(dictionary[block.block_id]));

    lesson.blocks = blocks;
  } catch (err) {
    return { lesson };
  }

  return { lesson };
}
