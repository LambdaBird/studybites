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
    knex,
    models: { Result, Lesson, LessonBlockStructure },
  } = this;

  const status = {};

  const checkStatus = await Result.query()
    .where({
      userId,
      lessonId,
    })
    // eslint-disable-next-line func-names
    .andWhere(function () {
      this.where({ action: 'start' }).orWhere({ action: 'finish' });
    });

  checkStatus.forEach((entry) => {
    status[entry.action] = true;
  });

  if (status.finish) {
    const lesson = await Lesson.query()
      .findById(lessonId)
      .withGraphFetched('authors')
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
      return { total: 0, lesson, isFinal: false };
    }

    const { count } = await LessonBlockStructure.query()
      .first()
      .count('blockId')
      .where({
        lessonId,
      });

    const { blockId: final } = await LessonBlockStructure.query()
      .first()
      .where({
        lessonId,
      })
      .whereNull('childId');

    const results = await Result.query()
      .select('results.data', 'results.blockId', 'results.revision')
      .from(
        knex.raw(`
          (select block_id, max(created_at) as created_at from results 
          where lesson_id = ${lessonId} and user_id = ${userId} and data is not null group by block_id) as temp
        `),
      )
      .join(
        knex.raw(
          `results on results.block_id = temp.block_id and results.created_at = temp.created_at`,
        ),
      );

    lesson.blocks = lesson.blocks.map((block) => ({
      ...block,
      ...results.find(
        (result) =>
          result.blockId === block.blockId &&
          result.revision === block.revision,
      ),
    }));

    const isFinal = lesson.blocks.some((block) => block.blockId === final);

    return { total: +count, lesson, isFinal };
  }

  if (!status.start) {
    const lesson = await Lesson.query()
      .findById(lessonId)
      .withGraphFetched('authors');

    if (!lesson) {
      throw new NotFoundError(NOT_FOUND);
    }

    lesson.blocks = [];

    const { count } = await LessonBlockStructure.query()
      .first()
      .count('blockId')
      .where({
        lessonId,
      });

    const { blockId: final } =
      (await LessonBlockStructure.query()
        .first()
        .where({
          lessonId,
        })
        .whereNull('childId')) || {};

    const isFinal = lesson.blocks.some((block) => block.blockId === final);

    return { total: +count, lesson, isFinal };
  }

  const check = await Result.query()
    .first()
    .select('results.*')
    // eslint-disable-next-line func-names
    .from(function () {
      this.select(this.knex().raw('max(created_at) as created_at'))
        .from('results')
        .where({
          userId,
          lessonId,
        })
        .whereIn('action', config.interactiveActions)
        .as('temporary');
    })
    .join('results', 'results.created_at', '=', 'temporary.created_at')
    .debug();

  const lesson = await Lesson.query()
    .findById(lessonId)
    .withGraphFetched('authors')
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

    if (check && check.blockId) {
      blocksOrder.map((block) => blocks.push(dictionary[block.block_id]));

      const temp = [];

      for (let i = 0, n = blocks.length; i < n; i += 1) {
        if (
          config.interactiveBlocks.includes(
            dictionary[blocksOrder[i].block_id].type,
          ) &&
          temp.some((block) => block.blockId === check.blockId)
        ) {
          delete blocks[i].answer;
          delete blocks[i].weight;

          temp.push(blocks[i]);

          break;
        }

        temp.push(blocks[i]);
      }

      lesson.blocks = temp;
    } else {
      for (let i = 0, n = blocksOrder.length; i < n; i += 1) {
        delete dictionary[blocksOrder[i].block_id].answer;
        delete dictionary[blocksOrder[i].block_id].weight;

        blocks.push(dictionary[blocksOrder[i].block_id]);

        if (
          config.interactiveBlocks.includes(
            dictionary[blocksOrder[i].block_id].type,
          )
        ) {
          break;
        }
      }

      lesson.blocks = blocks;
    }
  } catch (err) {
    return { total: 0, lesson, isFinal: false };
  }

  const { count } = await LessonBlockStructure.query()
    .first()
    .count('blockId')
    .where({
      lessonId,
    });

  const { blockId: final } = await LessonBlockStructure.query()
    .first()
    .where({
      lessonId,
    })
    .whereNull('childId');

  const results = await Result.query()
    .select('results.data', 'results.blockId', 'results.revision')
    .from(
      knex.raw(`
          (select block_id, max(created_at) as created_at from results 
          where lesson_id = ${lessonId} and user_id = ${userId} and data is not null group by block_id) as temp
        `),
    )
    .join(
      knex.raw(
        `results on results.block_id = temp.block_id and results.created_at = temp.created_at`,
      ),
    );

  lesson.blocks = lesson.blocks.map((block) => ({
    ...block,
    ...results.find(
      (result) =>
        result.blockId === block.blockId && result.revision === block.revision,
    ),
  }));

  const isFinal = lesson.blocks.some((block) => block.blockId === final);

  return { total: +count, lesson, isFinal };
}
