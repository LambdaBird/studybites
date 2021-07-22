import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import apiConfig from '@sb-ui/utils/api/config';
import { getLessonById, postLessonById } from '@sb-ui/utils/api/v1/student';
import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';

import {
  createFinishBlock,
  createFinished,
  createStartBlock,
} from './useLearnChunks.util';

export const convertBlocksToChunks = (blocks) => {
  let lastIndex = 0;
  const chunks = blocks.reduce((acc, block, i) => {
    if (apiConfig.interactiveBlocks.includes(block.type)) {
      acc.push(blocks.slice(lastIndex, i + 1));
      lastIndex = i + 1;
    }
    return acc;
  }, []);
  if (lastIndex !== blocks.length) {
    chunks.push(blocks.slice(lastIndex, blocks.length));
  }
  return chunks;
};

export const createChunksFromBlocks = ({
  blocks,
  isFinished,
  isFinal,
  isPost = false,
}) => {
  const isEmptyBlocks = blocks.length === 0;

  if (isEmptyBlocks && !isFinished && !isPost && !isFinal) {
    return [[createStartBlock(false)]];
  }

  const isLastInteractiveResolved = blocks[blocks.length - 1]?.isSolved;

  const isLastNonInteractiveBlock = !apiConfig.interactiveBlocks.includes(
    blocks[blocks.length - 1]?.type,
  );

  const chunks = convertBlocksToChunks(blocks);
  if (isFinished) {
    if (isLastNonInteractiveBlock && !isEmptyBlocks) {
      chunks[chunks.length - 1].push(createFinished(false));
    } else {
      chunks.push([createFinished(false)]);
    }
  } else if (isLastInteractiveResolved || isEmptyBlocks) {
    chunks.push([createFinishBlock(false)]);
  } else if (isLastNonInteractiveBlock) {
    chunks[chunks.length - 1].push(createFinishBlock(false));
  }
  return chunks;
};

export const handleAnswer = ({ data: serverData, prevChunks }) => {
  const { isFinished, answer, blocks, userAnswer } = serverData;

  const lastChunk = prevChunks?.[prevChunks.length - 1];

  const interactiveBlock = lastChunk[lastChunk.length - 1];
  if (answer?.results?.length > 0) {
    interactiveBlock.answer = answer;
    interactiveBlock.content.data.answers =
      interactiveBlock.content.data.answers.map((x, i) => ({
        ...x,
        correct: userAnswer?.response[i],
      }));
  }

  if (interactiveBlock) {
    interactiveBlock.isSolved = true;
  }
  return [
    ...prevChunks,
    ...createChunksFromBlocks({
      blocks,
      isFinished,
      isPost: true,
    }),
  ];
};

export const useLearnChunks = ({ lessonId }) => {
  const [chunks, setChunks] = useState([]);
  const [total, setTotal] = useState(0);
  const [lesson, setLesson] = useState({});

  const { data: getData, isLoading } = useQuery(
    [
      LESSON_BASE_QUERY,
      {
        id: lessonId,
      },
    ],
    getLessonById,
  );

  const onSuccess = useCallback(
    (data) => {
      setChunks((prevChunks) => handleAnswer({ data, prevChunks }));
    },
    [setChunks],
  );

  const { mutate: handleInteractiveClick } = useMutation(postLessonById, {
    onSuccess,
  });

  useEffect(() => {
    if (getData) {
      const {
        isFinal,
        lesson: newLesson,
        isFinished,
        total: newTotal,
      } = getData;
      setChunks(
        createChunksFromBlocks({
          blocks: newLesson?.blocks,
          isFinished,
          isFinal,
          isPost: false,
        }),
      );
      setTotal(newTotal);
      setLesson(newLesson);
    }
  }, [getData]);

  return {
    handleInteractiveClick,
    chunks,
    total,
    lesson,
    isLoading,
  };
};
