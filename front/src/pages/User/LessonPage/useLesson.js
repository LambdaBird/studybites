import { useHistory, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';
import { getLessonById, postLessonById } from '@sb-ui/utils/api/v1/student';
import {
  groupBlocks,
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

  const getNextLength = useCallback(
    (dataBlocks) => dataBlocks.filter((x) => x.type === 'next').length,
    [],
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
        if (lesson?.blocks?.length === totalBlocks) {
          setNextCount(getNextLength(dataBlocks));
          setBlocks([...groupBlocks(dataBlocks)]);
          setInteractiveBlock(null);
        } else {
          setNextCount((prev) => prev + getNextLength(dataBlocks));
          setBlocks((prev) => {
            const newPrev = JSON.parse(JSON.stringify(prev));
            if (answers) {
              newPrev[newPrev.length - 1][0].content.data.answers = newPrev[
                newPrev.length - 1
              ]?.[0]?.content?.data?.answers?.map((x, i) => ({
                ...x,
                correct: answers[i],
              }));
              newPrev[newPrev.length - 1][0].answer = {
                results: lesson?.answer?.results,
              };
            }
            return [...newPrev, ...groupBlocks(dataBlocks)];
          });
          const lastBlock = dataBlocks[dataBlocks.length - 1];
          if (lastBlock) {
            setInteractiveBlock(lastBlock);
          }
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
      setBlocks(groupBlocks(dataBlocks));
      setNextCount(getNextLength(dataBlocks));
      if (totalData === dataBlocks.length) {
        setInteractiveBlock(null);
      } else {
        const lastBlock = dataBlocks[dataBlocks.length - 1];
        if (lastBlock) {
          setInteractiveBlock(lastBlock);
        }
      }
    }
  }, [responseData]);

  const { lesson } = useMemo(() => responseData || {}, [responseData]);

  const handleStartClick = useCallback(() => {
    mutate({ id: lessonId, action: 'start' });
  }, [lessonId, mutate]);

  const handleNextClick = useCallback(() => {
    const { revision, blockId } = interactiveBlock;
    mutate({ id: lessonId, action: 'next', revision, blockId });
  }, [interactiveBlock, mutate, lessonId]);

  const handleFinishClick = useCallback(() => {
    mutate({ id: lessonId, action: 'finish' });
    history.push(USER_HOME);
  }, [history, lessonId, mutate]);

  const handleSendClick = useCallback(() => {
    const { revision, blockId } = interactiveBlock;
    mutate({
      id: lessonId,
      action: 'response',
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
