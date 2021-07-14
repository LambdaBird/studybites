import { v4 } from 'uuid';

import config from '../../../../config';

import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';

export const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        lesson: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string', enum: config.lessonStatuses },
          },
          required: ['name'],
        },
        blocks: { type: 'array', default: [] },
      },
      required: ['lesson'],
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
              blocks: { type: ['array', 'null'] },
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
  async preHandler({ user: { id: userId } }) {
    await this.access({
      userId,
      roleId: config.roles.TEACHER.id,
    });
  },
};

export async function handler({
  body: { lesson, blocks },
  user: { id: userId },
}) {
  const {
    models: { Lesson, UserRole, Block, LessonBlockStructure },
  } = this;

  try {
    const data = await Lesson.transaction(async (trx) => {
      const lessonData = await Lesson.query(trx).insert(lesson).returning('*');

      await UserRole.query(trx)
        .insert({
          userId,
          roleId: config.roles.MAINTAINER.id,
          resourceType: config.resources.LESSON,
          resourceId: lessonData.id,
        })
        .returning('*');

      if (blocks && blocks.length) {
        const blocksData = await Block.query(trx).insert(blocks).returning('*');

        lessonData.blocks = blocksData;

        const blockStructure = [];

        for (let i = 0, n = blocksData.length; i < n; i += 1) {
          blockStructure.push({
            id: v4(),
            lessonId: lessonData.id,
            blockId: blocksData[i].blockId,
          });
        }

        for (let i = 0, n = blockStructure.length; i < n; i += 1) {
          blockStructure[i].parentId = !i ? null : blockStructure[i - 1].id;
          blockStructure[i].childId =
            i === n - 1 ? null : blockStructure[i + 1].id;
        }

        await LessonBlockStructure.query(trx).insert(blockStructure);
      }

      return lessonData;
    });

    return { lesson: data };
  } catch (err) {
    throw new Error(err);
  }
}
