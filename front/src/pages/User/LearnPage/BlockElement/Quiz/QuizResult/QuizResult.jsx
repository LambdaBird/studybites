import { useMemo } from 'react';

import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';
import {
  QuizBlockAnswerType,
  QuizBlockDataType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import AnswersResult from './AnswerResult';
import { verifyAnswers } from './utils';
import * as S from './QuizResult.styled';

const QuizResult = ({ data, correctAnswer }) => {
  const { question, answers } = data;

  const options = answers?.map(({ value, correct }, i) => ({
    label: htmlToReact(value),
    value: i,
    correct,
  }));

  const { correct, result } = verifyAnswers(answers, correctAnswer?.results);

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
        <AnswersResult result={result} correct={correct} />
      </ChunkWrapper>
    </>
  );
};

QuizResult.propTypes = {
  data: QuizBlockDataType,
  correctAnswer: QuizBlockAnswerType,
};

export default QuizResult;
