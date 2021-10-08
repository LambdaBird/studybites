import { BadRequestError } from '../../../validation/errors';

const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        action: { type: 'string' },
        blockId: { type: 'string' },
        revision: { type: 'string' },
        reply: {
          type: 'object',
          additionalProperties: false,
          properties: {
            question: { type: 'string' },
            answers: { type: 'array' },
            response: { type: ['array', 'string'] },
            words: { type: ['array', 'string'] },
            isSolved: { type: 'boolean' },
            value: { type: 'string' },
          },
          oneOf: [
            {
              required: ['answers'],
            },
            {
              required: ['response'],
            },
            {
              required: ['isSolved'],
            },
            {
              required: ['value'],
            },
            {
              required: ['words'],
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
          reply: { type: 'null', const: null },
        },
        required: ['action'],
      },
      else: {
        required: ['action', 'blockId', 'revision', 'reply'],
      },
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    const { resources, roles } = this.config.globals;

    await this.access({
      userId,
      resourceId,
      resourceType: resources.LESSON.name,
      roleId: roles.STUDENT.id,
      status: resources.LESSON.learnStatus,
    });
  },
};

export async function checkAllowed({
  userId,
  lessonId,
  Result,
  LessonBlockStructure,
  blockConstants,
}) {
  /**
   * variable for the last block of a chunk
   */
  let block;
  /**
   * get a last record from the results table
   */
  const lastResult = await Result.getLastResult({ userId, lessonId });
  /**
   * if no records in the results table return 'start' as the allowed action
   */
  if (!lastResult) {
    return {
      allowed: { action: 'start' },
    };
  }
  /**
   * if last record is the 'finish' action return null as allowed
   * to throw error inside the route handler
   */
  if (lastResult.action === 'finish') {
    return {
      allowed: null,
    };
  }
  /**
   * if last record is the 'start' action get a chunk of blocks from start
   * to the next interactive block and return allowed action based on blocks type
   */
  if (lastResult.action === 'start') {
    const { chunk } = await LessonBlockStructure.getChunk({ lessonId });
    block = chunk[chunk.length - 1];
  }
  /**
   * else get a chunk of blocks from last record to the next interactive
   * and return allowed action based on blocks type
   */
  if (!block) {
    const { chunk } = await LessonBlockStructure.getChunk({
      lessonId,
      previousBlock: lastResult.blockId,
    });
    block = chunk[chunk.length - 1];
  }

  /**
   * if block is undefined -> finish
   */
  if (!block || blockConstants.STATIC_BLOCKS.includes(block.type)) {
    return {
      allowed: { action: 'finish' },
    };
  }
  /**
   * find allowed action based on blocks type
   */
  if (block.type === blockConstants.blocks.NEXT) {
    return {
      allowed: {
        action: 'next',
        blockId: block.blockId,
        revision: block.revision,
      },
    };
  }

  if (blockConstants.INTERACTIVE_BLOCKS.includes(block.type)) {
    return {
      allowed: {
        action: 'response',
        blockId: block.blockId,
        revision: block.revision,
      },
    };
  }

  return {
    allowed: null,
  };
}

async function handler({
  user: { id: userId },
  params: { lessonId },
  body: { action, blockId, revision, reply },
}) {
  const {
    config: {
      globals: { blockConstants },
      lessonService: { lessonServiceErrors: errors },
    },
    models: { Result, LessonBlockStructure, Block },
  } = this;
  /**
   * get allowed action type
   */
  const { allowed } = await checkAllowed({
    userId,
    lessonId,
    Result,
    LessonBlockStructure,
    blockConstants,
  });
  /**
   * allowed will be null if the lesson was finished already
   */
  if (!allowed) {
    throw new BadRequestError(errors.LESSON_ERR_FAIL_LEARN);
  }
  /**
   * check if action != allowed action
   */
  if (action !== allowed.action) {
    throw new BadRequestError(errors.LESSON_ERR_FAIL_LEARN);
  }
  if (blockConstants.INTERACTIVE_ACTIONS.includes(action)) {
    if (blockId !== allowed.blockId || revision !== allowed.revision) {
      throw new BadRequestError(errors.LESSON_ERR_FAIL_LEARN);
    }
  }

  let correctness;
  if (action === 'response') {
    correctness = await Block.getCorrectness({
      blockId,
      revision,
      userResponse: reply,
    });
  }

  /**
   * write action to the results table
   */
  await Result.insertOne({
    userId,
    lessonId,
    action,
    blockId,
    revision,
    data: reply,
    correctness,
  });

  const { count: total } = await LessonBlockStructure.countBlocks({
    lessonId,
  });
  /**
   * get all blocks on finish
   */
  if (action === 'finish') {
    const blocks = [];
    return { total, blocks, isFinished: true };
  }
  /**
   * else get the next chunk of blocks
   */
  const { chunk, isFinal } = await LessonBlockStructure.getChunk({
    lessonId,
    previousBlock: blockId,
  });
  /**
   * if action is response -> get the answer for the block
   */
  if (action === 'response') {
    const { answer } = await Block.query()
      .select('answer')
      .first()
      .where({ block_id: blockId, revision });
    return { total, blocks: chunk, isFinal, reply, answer };
  }

  return { total, blocks: chunk, isFinal };
}

export default { options, handler };
