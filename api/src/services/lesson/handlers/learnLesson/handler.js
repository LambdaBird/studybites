import { BadRequestError } from '../../../../validation/errors';
import { blockConstants } from '../../../../config';

import { getCorrectness } from './correctnessCalculation';

export async function checkAllowed({
  userId,
  lessonId,
  Result,
  LessonBlockStructure,
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
  if (!block) {
    return {
      allowed: { action: 'finish' },
    };
  }
  /**
   * find allowed action based on blocks type
   */
  switch (block.type) {
    case blockConstants.blocks.NEXT:
      return {
        allowed: {
          action: 'next',
          blockId: block.blockId,
          revision: block.revision,
        },
      };
    case blockConstants.blocks.QUIZ:
      return {
        allowed: {
          action: 'response',
          blockId: block.blockId,
          revision: block.revision,
        },
      };
    case blockConstants.blocks.CLOSED_QUESTION:
      return {
        allowed: {
          action: 'response',
          blockId: block.blockId,
          revision: block.revision,
        },
      };
    default:
      return {
        allowed: { action: 'finish' },
      };
  }
}

export async function learnLessonHandler({
  user: { id: userId },
  params: { lessonId },
  body: { action, blockId, revision, data },
}) {
  const {
    config: {
      globals: {
        // eslint-disable-next-line no-shadow
        blockConstants: { blocks: blockConstants, INTERACTIVE_ACTIONS },
      },
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
  if (INTERACTIVE_ACTIONS.includes(action)) {
    if (blockId !== allowed.blockId || revision !== allowed.revision) {
      throw new BadRequestError(errors.LESSON_ERR_FAIL_LEARN);
    }
  }

  let correctness;
  if (action === 'response') {
    correctness = await getCorrectness({
      Block,
      blockId,
      revision,
      userResponse: data.response,
      blocks: blockConstants,
      BadRequestError,
      error: errors.LESSON_ERR_FAIL_LEARN,
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
    data,
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
    return { total, blocks: chunk, isFinal, userAnswer: data, answer };
  }

  return { total, blocks: chunk, isFinal };
}
