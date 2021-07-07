import { useHistory, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';
import { getLessonById, postLessonById } from '@sb-ui/utils/api/v1/student';
import {
  FINISH_TYPE,
  NEXT_TYPE,
  RESPONSE_TYPE,
  START_TYPE,
  newGroupBlocks,
  prepareResultToAnswers,
} from '@sb-ui/pages/User/LessonPage/utils';
import { USER_HOME } from '@sb-ui/utils/paths';

export const useLesson = () => {
  const history = useHistory();
  const { id: lessonId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [interactiveBlock, setInteractiveBlock] = useState();
  const [quizAnswer, setQuizAnswer] = useState({});
  const [isFinal, setIsFinal] = useState(false);
  const [total, setTotal] = useState(0);
  const [nextCount, setNextCount] = useState(0);

  const { data: responseData, isLoading } = useQuery(
    [
      LESSON_BASE_QUERY,
      {
        id: lessonId,
      },
    ],
    getLessonById,
  );

  const addAnswersToPreviousBlocks = useCallback(
    (answers, results) => {
      const lastAnswer = JSON.parse(JSON.stringify(interactiveBlock));
      lastAnswer.content.data.answers = lastAnswer.content.data.answers.map(
        (x, i) => ({
          ...x,
          correct: answers[i],
        }),
      );
      lastAnswer.answer = {
        results,
      };
      return lastAnswer;
    },
    [interactiveBlock],
  );

  const { mutate } = useMutation(postLessonById, {
    onSuccess: (newBlocks) => {
      const { isFinal: finishStatus, lesson, total: totalBlocks } = newBlocks;
      if (finishStatus) {
        setIsFinal(finishStatus);
      }
      const answers = lesson?.userAnswer?.response;

      const dataBlocks = lesson?.blocks;
      if (dataBlocks) {
        const {
          blocks: groupedBlocks,
          lastInteractiveBlock,
          nextCount: nextBlocksCount,
        } = newGroupBlocks(dataBlocks);
        if (lesson?.blocks?.length === totalBlocks) {
          setNextCount(nextBlocksCount);
          setBlocks([...groupedBlocks]);
          setInteractiveBlock(null);
        } else {
          setNextCount((prev) => prev + nextCount);
          setBlocks((prev) => {
            if (answers) {
              return [
                ...prev,
                [addAnswersToPreviousBlocks(answers, lesson?.answer?.results)],
                ...groupedBlocks,
              ];
            }
            return [...prev, ...groupedBlocks];
          });
          setInteractiveBlock(lastInteractiveBlock);
        }
      }
    },
  });

  useEffect(() => {
    const preparedData = prepareResultToAnswers(responseData);
    const dataBlocks = preparedData?.lesson?.blocks;
    setIsFinal(preparedData?.isFinal || false);
    const totalData = preparedData?.total;
    setTotal(totalData);
    if (dataBlocks) {
      const {
        blocks: groupedBlocks,
        lastInteractiveBlock,
        nextCount: nextBlocksCount,
      } = newGroupBlocks(dataBlocks);
      setBlocks(groupedBlocks);
      setNextCount(nextBlocksCount);
      // eslint-disable-next-line no-unused-expressions
      totalData === dataBlocks.length
        ? setInteractiveBlock(null)
        : setInteractiveBlock(lastInteractiveBlock);
    }
  }, [responseData]);

  const { lesson } = useMemo(() => responseData || {}, [responseData]);

  const handleStartClick = useCallback(() => {
    mutate({ id: lessonId, action: START_TYPE });
  }, [lessonId, mutate]);

  const handleNextClick = useCallback(() => {
    const { revision, blockId } = interactiveBlock;
    mutate({ id: lessonId, action: NEXT_TYPE, revision, blockId });
  }, [interactiveBlock, mutate, lessonId]);

  const handleFinishClick = useCallback(() => {
    mutate({ id: lessonId, action: FINISH_TYPE });
    history.push(USER_HOME);
  }, [history, lessonId, mutate]);

  const handleSendClick = useCallback(() => {
    const { revision, blockId } = interactiveBlock;
    mutate({
      id: lessonId,
      action: RESPONSE_TYPE,
      revision,
      blockId,
      data: {
        response: interactiveBlock?.content?.data?.answers.map(
          (x, i) => !!quizAnswer.includes(i),
        ),
      },
    });
  }, [interactiveBlock, lessonId, mutate, quizAnswer]);

  return {
    handleStartClick,
    handleNextClick,
    handleFinishClick,
    handleSendClick,
    setQuizAnswer,
    lesson,
    interactiveBlock,
    blocks,
    total,
    nextCount,
    isFinal,
    isLoading,
  };
};
