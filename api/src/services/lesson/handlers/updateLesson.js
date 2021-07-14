import { v4 } from 'uuid';

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
        },
        blocks: { type: 'array' },
      },
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
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    await this.access({
      userId,
      resourceId,
      resourceType: config.resources.LESSON,
      roleId: config.roles.MAINTAINER.id,
    });
  },
};

export async function handler({
  body: { lesson = {}, blocks },
  params: { lessonId },
  user: { id: userId },
}) {
  const {
    knex,
    models: { Lesson, UserRole, Block, LessonBlockStructure },
  } = this;

  try {
    const data = await Lesson.transaction(async (trx) => {
      await UserRole.relatedQuery('lessons')
        .for(
          UserRole.query().select().where({
            userId,
            roleId: config.roles.MAINTAINER.id,
            resourceId: lessonId,
          }),
        )
        .patch(lesson)
        .returning('*');

      const lessonData = await Lesson.query().findById(lessonId);

      if (blocks) {
        const revisions = await Block.query(trx)
          .select(
            knex.raw(
              `json_object_agg(grouped.block_id, grouped.revisions) as values`,
            ),
          )
          .from(
            knex.raw(
              `(select block_id, array_agg(revision) as revisions from blocks group by block_id) as grouped`,
            ),
          );

        const { values } = revisions[0];

        const blocksToInsert = [];

        for (let i = 0, n = blocks.length; i < n; i += 1) {
          const { revision, blockId } = blocks[i];

          if (revision && !blockId) {
            // eslint-disable-next-line no-param-reassign
            blocks[i].blockId = v4();
            blocksToInsert.push(blocks[i]);
          }

          if (revision && blockId) {
            if (values[blockId] && !values[blockId].includes(revision)) {
              blocksToInsert.push(blocks[i]);
            }
          }
        }

        if (blocksToInsert.length) {
          const blocksData = await Block.query(trx)
            .insert(blocksToInsert)
            .returning('*');

          lessonData.blocks = blocksData;
        }

        const blockStructure = [];

        for (let i = 0, n = blocks.length; i < n; i += 1) {
          blockStructure.push({
            id: v4(),
            lessonId,
            blockId: blocks[i].blockId,
          });
        }

        for (let i = 0, n = blockStructure.length; i < n; i += 1) {
          blockStructure[i].parentId = !i ? null : blockStructure[i - 1].id;
          blockStructure[i].childId =
            i === n - 1 ? null : blockStructure[i + 1].id;
        }

        await LessonBlockStructure.query(trx).delete().where({ lessonId });

        if (blockStructure.length) {
          await LessonBlockStructure.query(trx).insert(blockStructure);
        }
      }

      return lessonData;
    });

    return { lesson: data };
  } catch (err) {
    throw new Error(err);
  }
}
