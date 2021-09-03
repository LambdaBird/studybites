import { useCallback, useContext, useMemo, useState } from 'react';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { htmlToReact, RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import { verifyAnswers } from './verifyAnswers';
import * as S from './Quiz.styled';

const convertDataToOptions = (data) => {
  return data?.map(({ value, correct }, i) => ({
    label: <S.CheckboxText>{htmlToReact(value)}</S.CheckboxText>,
    value: i,
    correct,
  }));
};

export const useQuiz = ({ blockId, revision, answer, content, reply }) => {
  const { handleInteractiveClick, id } = useContext(LearnContext);

  const [quizCheckbox, setQuizCheckbox] = useState([]);

  const { answers } = content?.data;
  const correctResults = answer?.results;

  const userAnswers = answers.map((x, i) => ({
    ...x,
    correct: reply?.response?.[i],
  }));

  const options = useMemo(() => convertDataToOptions(answers), [answers]);
  const optionsResult = useMemo(
    () => convertDataToOptions(userAnswers),
    [userAnswers],
  );

  const { correct, result } = useMemo(
    () => verifyAnswers(userAnswers, correctResults),
    [userAnswers, correctResults],
  );

  const valueResult = useMemo(
    () =>
      optionsResult
        ?.map((x) => (x.correct ? x.value : null))
        .filter((x) => x !== null),
    [optionsResult],
  );

  const optionsCorrect = useMemo(() => convertDataToOptions(result), [result]);

  const valueCorrect = useMemo(
    () =>
      result?.map((x, i) => (x.correct ? i : null)).filter((x) => x !== null),
    [result],
  );

  const handleSendClick = useCallback(() => {
    handleInteractiveClick({
      id,
      action: RESPONSE_TYPE,
      blockId,
      revision,
      reply: { response: answers.map((x, i) => !!quizCheckbox.includes(i)) },
    });
  }, [answers, blockId, handleInteractiveClick, id, quizCheckbox, revision]);

  return {
    handleSendClick,
    options,
    setQuizCheckbox,
    optionsResult,
    valueResult,
    optionsCorrect,
    valueCorrect,
    correct,
  };
};
