import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { interactiveTypesBlocks } from '@sb-ui/utils/api/config';
import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';

import { createFinishBlock, createStartBlock } from './useLearnChunks.util';

export const convertBlocksToChunks = (blocks) => {
  let lastIndex = 0;
  const chunks = blocks.reduce((acc, block, i) => {
    if (interactiveTypesBlocks.includes(block.type)) {
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

  const isLastNonInteractiveBlock = !interactiveTypesBlocks.includes(
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
  if (!isPost && chunks?.[0]?.[0]?.type !== 'start') {
    chunks.splice(0, 0, [createStartBlock(true)]);
  }

  return chunks;
};

export const handleAnswer = ({ data: serverData, prevChunks }) => {
  const {
    isFinished,
    answer,
    blocks,
    reply,
    isFinal: isFinalBlock,
  } = serverData;

  const lastChunk = prevChunks?.[prevChunks.length - 1];

  const interactiveBlock = lastChunk[lastChunk.length - 1];

  if (interactiveTypesBlocks.includes(interactiveBlock.type)) {
    interactiveBlock.answer = answer;
    interactiveBlock.reply = reply;
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

export const useLearnChunks = ({
  lessonId,
  getEnrolledLesson,
  postLessonById,
}) => {
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
    getEnrolledLesson,
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
      setIsFinalChunk(isFinalBlock);
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
