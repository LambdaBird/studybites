import { useMemo } from 'react';

import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import AnswersResult from '@sb-ui/pages/User/LessonPage/BlockElement/QuizBlockResult/AnswerResult';
import {
  QuizBlockAnswerType,
  QuizBlockDataType,
} from '@sb-ui/pages/User/LessonPage/BlockElement/types';
import { verifyAnswers } from '@sb-ui/pages/User/LessonPage/QuizBlock/utils';

import * as S from './QuizResult.styled';

const QuizResult = ({ data, correctAnswer }) => {
  const { question, answers } = data;

  const options = answers?.map(({ value, correct }, i) => ({
    label: value,
    value: i,
    correct,
  }));

  const { correct, difference } = verifyAnswers(
    answers.map((x) => x.correct),
    correctAnswer?.results,
  );

  const defaultValueAnswers = useMemo(
    () =>
      options
        ?.map((x) => (x.correct ? x.value : null))
        .filter((x) => x !== null),
    [options],
  );

  return (
    <>
      <ChunkWrapper>
        <S.Question>{question}</S.Question>
      </ChunkWrapper>
      <ChunkWrapper>
        <ColumnDisabledCheckbox value={defaultValueAnswers} options={options} />
      </ChunkWrapper>
      <ChunkWrapper>
        <AnswersResult
          difference={difference}
          options={options}
          correct={correct}
        />
      </ChunkWrapper>
    </>
  );
};

QuizResult.propTypes = {
  data: QuizBlockDataType,
  correctAnswer: QuizBlockAnswerType,
};

export default QuizResult;
