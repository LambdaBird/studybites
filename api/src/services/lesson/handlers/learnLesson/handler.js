import { BadRequestError } from '../../../../validation/errors';

import { INVALID_LEARN } from '../../constants';

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
    case 'next':
      return {
        allowed: {
          action: 'next',
          blockId: block.blockId,
          revision: block.revision,
        },
      };
    case 'quiz':
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
    config,
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
    throw new BadRequestError(INVALID_LEARN);
  }
  /**
   * check if action != allowed action
   */
  if (action !== allowed.action) {
    throw new BadRequestError(INVALID_LEARN);
  }
  if (config.interactiveActions.includes(action)) {
    if (blockId !== allowed.blockId || revision !== allowed.revision) {
      throw new BadRequestError(INVALID_LEARN);
    }
  }
  /**
   * write action to the results table
   */
  await Result.query().insert({
    userId,
    lessonId,
    action,
    blockId,
    revision,
    data,
  });
  /**
   * get all blocks on finish
   */
  if (action === 'finish') {
    const blocks = [];
    const { count } = await LessonBlockStructure.countBlocks({
      lessonId,
    });
    return { total: +count, blocks, isFinished: true };
  }
  /**
   * else get the next chunk of blocks
   */
  const { total, chunk, isFinal } = await LessonBlockStructure.getChunk({
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
      .where({ blockId, revision });
    return { total, blocks: chunk, isFinal, userAnswer: data, answer };
  }

  return { total, blocks: chunk, isFinal };
}
