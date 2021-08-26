import { BadRequestError } from '../../../../validation/errors';

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

export async function learnLessonHandler({
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
    const getCorrectnessResult = await Block.getCorrectness({
      blockId,
      revision,
      userResponse: reply,
    });
    if (getCorrectnessResult.error) {
      throw new BadRequestError(errors.LESSON_ERR_FAIL_LEARN);
    }
    correctness = getCorrectnessResult.correctness;
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
