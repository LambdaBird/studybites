import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import apiConfig from '@sb-ui/utils/api/config';
import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';

import {
  createFinishBlock,
  createFinished,
  createStartBlock,
  getMockedLessonById,
  postMockedLessonById,
} from './useLearnChunks.util';

const createChunks = ({ blocks, isFinished, lastChunk }) => {
  if (blocks?.length === 0 && !isFinished && !lastChunk) {
    return [[createStartBlock(false)]];
  }
  const chunks = [];
  let lastIndex = 0;
  blocks?.forEach((block, i) => {
    if (apiConfig.interactiveBlocks.includes(block.type)) {
      chunks.push(blocks.slice(lastIndex, i + 1));
      lastIndex = i + 1;
    }
  });

  if (isFinished) {
    chunks.push([createFinished(false)]);
  } else if (
    /*
     * Three cases of displaying 'Finish' button only if isFinished === false
     * 1. Last element is not interactive block
     * 2. Last element is interactive quiz block with RESULT (answer)
     * 3. Response blocks = []
     * */
    lastIndex !== blocks.length ||
    blocks[blocks.length - 1]?.answer?.results?.length > 0 ||
    blocks.length === 0
  ) {
    chunks.push([
      ...blocks.slice(lastIndex, blocks.length),
      createFinishBlock(false),
    ]);
  }

  return chunks;
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
    getMockedLessonById,
  );

  const onSuccess = (data) => {
    const { isFinished, lesson: newLesson } = data;
    setChunks((prevChunks) => {
      const lastChunk = prevChunks?.[prevChunks.length - 1];
      const interactiveBlock = lastChunk[lastChunk.length - 1];
      if (newLesson?.answer?.results?.length > 0) {
        interactiveBlock.answer = newLesson?.answer;
        interactiveBlock.content.data.answers =
          interactiveBlock.content.data.answers.map((x, i) => ({
            ...x,
            correct: newLesson?.data?.response[i],
          }));
      }
      if (interactiveBlock?.response) {
        interactiveBlock.response.isSolved = true;
      }
      return [
        ...prevChunks,
        ...createChunks({ blocks: newLesson?.blocks, isFinished, lastChunk }),
      ];
    });
  };

  const { mutate: handleInteractiveClick } = useMutation(postMockedLessonById, {
    onSuccess,
  });

  useEffect(() => {
    if (getData) {
      const { lesson: newLesson, isFinished, total: newTotal } = getData;
      setChunks((prevChunks) =>
        createChunks({
          blocks: newLesson?.blocks,
          isFinished,
          lastChunk: prevChunks?.[prevChunks?.length - 1],
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
