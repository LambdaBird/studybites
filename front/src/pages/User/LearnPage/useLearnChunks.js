import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import apiConfig from '@sb-ui/utils/api/config';
import { getLessonById, postLessonById } from '@sb-ui/utils/api/v1/student';
import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';

import { createFinishBlock, createStartBlock } from './useLearnChunks.util';

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
  isFinalBlock,
  isPost = false,
}) => {
  const isEmptyBlocks = blocks.length === 0;

  if (isEmptyBlocks && !isFinished && !isPost && !isFinalBlock) {
    return [[createStartBlock(false)]];
  }

  const isLastInteractiveResolved = blocks[blocks.length - 1]?.isSolved;

  const isLastNonInteractiveBlock = !apiConfig.interactiveBlocks.includes(
    blocks[blocks.length - 1]?.type,
  );

  const chunks = convertBlocksToChunks(blocks);
  if (isLastNonInteractiveBlock && !isEmptyBlocks) {
    chunks[chunks.length - 1].push(createFinishBlock(isFinished));
  }
  if (isLastInteractiveResolved) {
    chunks.push([createFinishBlock(isFinished)]);
  }
  if (isEmptyBlocks && isFinalBlock) {
    chunks.push([createFinishBlock(false)]);
  }

  if (!isPost && isFinished && isEmptyBlocks) {
    chunks.push([createFinishBlock(true)]);
  }

  return chunks;
};

export const handleAnswer = ({ data: serverData, prevChunks }) => {
  const {
    isFinished,
    answer,
    blocks,
    userAnswer,
    isFinal: isFinalBlock,
  } = serverData;

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
      isFinalBlock,
      isPost: true,
    }),
  ];
};

export const useLearnChunks = ({ lessonId }) => {
  const [chunks, setChunks] = useState([]);
  const [total, setTotal] = useState(0);
  const [lesson, setLesson] = useState({});
  const [learnProgress, setLearnProgress] = useState(0);
  const [passedBlocks, setPassedBlocks] = useState(0);
  const [progressStatus, setProgressStatus] = useState('normal');
  const [isFinalChunk, setIsFinalChunk] = useState(false);
  const [isFinishedLesson, setIsFinishedLesson] = useState(false);

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

  const onMutate = useCallback(
    (data) => {
      if (data.action === 'start' && !lesson.interactiveTotal) {
        setIsFinalChunk(true);
      }
      if (data.action === 'finish') {
        setProgressStatus('success');
      }
      if (data.action !== 'start' && data.action !== 'finish') {
        setPassedBlocks((prevPassed) => prevPassed + 1);
      }
    },
    [lesson],
  );

  const onError = useCallback(() => {
    setPassedBlocks((prevPassed) => prevPassed - 1);
  }, []);

  const { mutate: handleInteractiveClick } = useMutation(postLessonById, {
    onSuccess,
    onMutate,
    onError,
  });

  useEffect(() => {
    if (getData) {
      const {
        isFinal: isFinalBlock,
        lesson: newLesson,
        isFinished,
        total: newTotal,
      } = getData;
      setChunks(
        createChunksFromBlocks({
          blocks: newLesson?.blocks,
          isFinished,
          isFinalBlock,
          isPost: false,
        }),
      );
      setTotal(newTotal);
      setLesson(newLesson);
      setPassedBlocks(newLesson.interactivePassed);
      setProgressStatus(isFinished ? 'success' : 'normal');
      setIsFinalChunk(isFinal);
      setIsFinishedLesson(isFinished);
    }
  }, [getData]);

  useEffect(() => {
    if ((!lesson.interactiveTotal && isFinalChunk) || isFinishedLesson) {
      setLearnProgress(100);
    } else {
      setLearnProgress(
        Math.round((passedBlocks / lesson.interactiveTotal) * 100),
      );
    }
  }, [isFinalChunk, isFinishedLesson, passedBlocks, lesson]);

  return {
    handleInteractiveClick,
    chunks,
    total,
    lesson,
    isLoading,
    learnProgress,
    progressStatus,
  };
};
