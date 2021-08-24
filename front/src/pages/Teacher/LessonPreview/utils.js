import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';

export const apiInteractiveBlocks = [
  BLOCKS_TYPE.QUIZ,
  BLOCKS_TYPE.NEXT,
  BLOCKS_TYPE.CLOSED_QUESTION,
  BLOCKS_TYPE.MATCH,
];

const findChunk = ({ blocks, startIndex, fromStart = false }) => {
  let remainingBlocks = blocks;
  if (startIndex) {
    remainingBlocks = blocks.slice(startIndex);
  }
  const dictionary = remainingBlocks.map((block) => block.type);
  for (let i = 0, n = dictionary.length; i < n; i += 1) {
    if (apiInteractiveBlocks.includes(dictionary[i])) {
      if (fromStart) {
        return {
          chunk: blocks.slice(0, i + 1 + startIndex),
          position: i + 1 + startIndex,
        };
      }
      return {
        chunk: remainingBlocks.slice(0, i + 1),
        position: i + 1 + startIndex,
      };
    }
  }

  if (fromStart) {
    return { chunk: blocks, position: blocks.length };
  }
  return { chunk: remainingBlocks, position: blocks.length };
};

const getChunk = ({ blocks, previousBlock = null, fromStart = false }) => {
  const total = blocks.length;

  if (!previousBlock) {
    const { chunk, position } = findChunk({ blocks });
    return { total, chunk, isFinal: position === total };
  }

  const dictionary = blocks.map((block) => block.blockId);

  for (let i = 0, n = dictionary.length; i < n; i += 1) {
    if (dictionary[i] === previousBlock) {
      const { chunk, position } = findChunk({
        blocks,
        startIndex: i + 1,
        fromStart,
      });
      return {
        total,
        chunk,
        isFinal: position === total,
      };
    }
  }

  return { total, chunk: [], isFinal: true };
};

export const postLessonByIdPreview = (data) => (props) => {
  const { lesson } = data || {};
  const { action, blockId, reply: dataResponse } = props;

  const { chunk, isFinal } = getChunk({
    blocks: lesson.blocks,
    previousBlock: blockId,
  });

  const newChunk = chunk.map((block) => ({
    ...block,
    answer: undefined,
    weight: undefined,
  }));

  if (action === 'finish') {
    return {
      blocks: [],
      isFinished: true,
    };
  }

  if (action === 'response') {
    const quizBlock = lesson.blocks.find((x) => x.blockId === blockId);
    return {
      blocks: newChunk,
      isFinal,
      reply: dataResponse,
      answer: quizBlock.answer,
    };
  }

  return { blocks: newChunk, isFinal };
};
