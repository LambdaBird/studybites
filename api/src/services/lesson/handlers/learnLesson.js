import config from '../../../../config';

import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';
import { BadRequestError, NotFoundError } from '../../../validation/errors';

import {
  ALREADY_FINISHED,
  ALREADY_STARTED,
  INVALID_LEARN,
  INVALID_NEXT,
  NOT_FINISHED,
  NOT_FOUND,
  NOT_STARTED,
} from '../constants';

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
        action: { type: 'string' },
        blockId: { type: 'string' },
        revision: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            answers: { type: 'array' },
            response: { type: 'array' },
          },
        },
      },
      required: ['action'],
    },
    response: {
      // 200: {
      //   type: 'object',
      //   properties: {
      //     total: { type: 'number' },
      //     lesson: {
      //       type: 'object',
      //       properties: {
      //         id: { type: 'number' },
      //         name: { type: 'string' },
      //         description: { type: ['string', 'null'] },
      //         status: { type: 'string' },
      //         createdAt: { type: 'string' },
      //         updatedAt: { type: 'string' },
      //         authors: { type: 'array' },
      //         blocks: { type: ['array', 'null'] },
      //         answer: { type: 'object' },
      //         userAnswer: { type: 'object' },
      //       },
      //     },
      //     isFinal: { type: 'boolean' },
      //   },
      //   required: ['total', 'lesson', 'isFinal'],
      // },
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

export async function handler({
  user: { id: userId },
  params: { lessonId },
  body,
}) {
  const {
    knex,
    models: { Result, LessonBlockStructure, Lesson, Block },
  } = this;

  const status = {};

  const { action } = body;

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
    throw new BadRequestError(ALREADY_FINISHED);
  }

  if (!status.start && action !== 'start') {
    throw new BadRequestError(NOT_STARTED);
  }

  switch (action) {
    case 'start': {
      if (status.start) {
        throw new BadRequestError(ALREADY_STARTED);
      }

      await Result.query().insert({
        lessonId,
        userId,
        action: 'start',
      });

      break;
    }
    case 'finish': {
      const { finished } = await Result.query()
        .first()
        .select(knex.raw('array_agg(block_id) as finished'))
        .where({
          lessonId,
          userId,
        })
        .whereIn('action', config.interactiveActions);

      const { blocks } = await LessonBlockStructure.query()
        .first()
        .select(knex.raw('array_agg(blocks.block_id) as blocks'))
        .join(
          'blocks',
          'lesson_block_structure.block_id',
          '=',
          'blocks.block_id',
        )
        .where({ lessonId })
        .whereIn('blocks.type', config.interactiveBlocks);

      if (!finished) {
        throw new BadRequestError(NOT_FINISHED);
      }

      if (finished && !blocks.every((block) => finished.includes(block))) {
        throw new BadRequestError(NOT_FINISHED);
      }

      await Result.query().insert({
        lessonId,
        userId,
        action: 'finish',
      });

      break;
    }
    case 'resume': {
      const { blockId, revision } = await Result.query()
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
            .as('temporary');
        })
        .join('results', 'results.created_at', '=', 'temporary.created_at');

      await Result.query().insert({
        lessonId,
        userId,
        action: 'resume',
        blockId,
        revision,
      });

      if (blockId) {
        const { parent } = await LessonBlockStructure.query()
          .first()
          .select('id as parent')
          .where({ lessonId, blockId });

        status.parent = parent;
      }

      break;
    }
    case 'next': {
      const { blockId, revision } = body;

      if (!blockId || !revision) {
        throw new BadRequestError(INVALID_NEXT);
      }

      const check = await LessonBlockStructure.query().first().where({
        lessonId,
        blockId,
      });

      if (!check) {
        throw new BadRequestError(INVALID_LEARN);
      }

      const { start } = await LessonBlockStructure.query()
        .first()
        .select('id as start')
        .where({ lessonId })
        .whereNull('parentId');

      const { blocksInOrder } = await LessonBlockStructure.query()
        .first()
        .select(
          knex.raw(
            `array_agg(lesson_block_structure.block_id) as blocks_in_order`,
          ),
        )
        .from(
          knex.raw(`connectby('lesson_block_structure', 'id', 'parent_id', '${start}', 0, '~') 
                as temporary(id uuid, parent_id uuid, level int, branch text)`),
        )
        .join(
          'lesson_block_structure',
          'lesson_block_structure.id',
          '=',
          'temporary.id',
        )
        .join(
          'blocks',
          'blocks.block_id',
          '=',
          'lesson_block_structure.block_id',
        )
        .whereIn('blocks.type', config.interactiveBlocks);

      const blocks = blocksInOrder.splice(0, blocksInOrder.indexOf(blockId));

      const { finished } = await Result.query()
        .first()
        .select(knex.raw('array_agg(block_id) as finished'))
        .where({
          lessonId,
          userId,
        })
        .whereIn('action', config.interactiveActions);

      if (blocks.length && !finished) {
        throw new BadRequestError(INVALID_LEARN);
      }

      if (
        finished &&
        blocks.length &&
        !blocks.every((block) => finished.includes(block))
      ) {
        throw new BadRequestError(INVALID_LEARN);
      }

      await Result.query().insert({
        lessonId,
        userId,
        action: 'next',
        blockId,
        revision,
      });

      const { parent } = await LessonBlockStructure.query()
        .first()
        .select('id as parent')
        .where({ lessonId, blockId });

      status.parent = parent;

      break;
    }
    case 'response': {
      const { blockId, revision, data } = body;

      if (!blockId || !revision || !data) {
        throw new BadRequestError(INVALID_LEARN);
      }

      const { start } = await LessonBlockStructure.query()
        .first()
        .select('id as start')
        .where({ lessonId })
        .whereNull('parentId');

      const { blocksInOrder } = await LessonBlockStructure.query()
        .first()
        .select(
          knex.raw(
            `array_agg(lesson_block_structure.block_id) as blocks_in_order`,
          ),
        )
        .from(
          knex.raw(`connectby('lesson_block_structure', 'id', 'parent_id', '${start}', 0, '~') 
                as temporary(id uuid, parent_id uuid, level int, branch text)`),
        )
        .join(
          'lesson_block_structure',
          'lesson_block_structure.id',
          '=',
          'temporary.id',
        )
        .join(
          'blocks',
          'blocks.block_id',
          '=',
          'lesson_block_structure.block_id',
        )
        .whereIn('blocks.type', config.interactiveBlocks);

      const blocks = blocksInOrder.splice(0, blocksInOrder.indexOf(blockId));

      const { finished } = await Result.query()
        .first()
        .select(knex.raw('array_agg(block_id) as finished'))
        .where({
          lessonId,
          userId,
        })
        .whereIn('action', config.interactiveActions);

      if (blocks.length && !finished) {
        throw new BadRequestError(INVALID_LEARN);
      }

      if (
        finished &&
        blocks.length &&
        !blocks.every((block) => finished.includes(block))
      ) {
        throw new BadRequestError(INVALID_LEARN);
      }

      await Result.query().insert({
        lessonId,
        userId,
        action: 'response',
        data,
        blockId,
        revision,
      });

      const { answer } = await Block.query().select('answer').first().where({
        blockId,
        revision,
      });

      const { parent } = await LessonBlockStructure.query()
        .first()
        .select('id as parent')
        .where({ lessonId, blockId });

      status.parent = parent;

      status.answer = answer;

      status.data = data;

      break;
    }
    default:
      throw new BadRequestError(INVALID_LEARN);
  }

  const lesson = await Lesson.query()
    .findById(lessonId)
    .withGraphFetched('blocks');

  if (!lesson) {
    throw new NotFoundError(NOT_FOUND);
  }

  lesson.answer = status.answer;

  if (status.data) {
    lesson.userAnswer = status.data;
  }
  try {
    if (!status.parent) {
      const { parent } = await LessonBlockStructure.query()
        .first()
        .select('id as parent')
        .where({ lessonId })
        .whereNull('parentId');

      status.parent = parent;
    }

    const { rows: blocksOrder } = await LessonBlockStructure.knex().raw(
      `select lesson_block_structure.block_id from connectby('lesson_block_structure', 'id', 'parent_id', '${status.parent}', 0, '~') 
          as temporary(id uuid, parent_id uuid, level int, branch text) join lesson_block_structure on temporary.id = lesson_block_structure.id`,
    );

    const blocks = [];

    const dictionary = lesson.blocks.reduce((result, filter) => {
      // eslint-disable-next-line no-param-reassign
      result[filter.blockId] = filter;
      return result;
    }, {});

    if (action === 'start') {
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
    } else if (action === 'finish') {
      for (let i = 0, n = blocksOrder.length; i < n; i += 1) {
        delete dictionary[blocksOrder[i].block_id].answer;
        delete dictionary[blocksOrder[i].block_id].weight;

        blocks.push(dictionary[blocksOrder[i].block_id]);
      }
    } else {
      for (let i = 0, n = blocksOrder.length; i < n; i += 1) {
        if (
          i === 0 &&
          config.interactiveBlocks.includes(
            dictionary[blocksOrder[i].block_id].type,
          )
        ) {
          // eslint-disable-next-line no-continue
          continue;
        }

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
    }

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

  const isFinal = lesson.blocks.some((block) => block.blockId === final);

  return { total: +count, lesson, isFinal };
}
