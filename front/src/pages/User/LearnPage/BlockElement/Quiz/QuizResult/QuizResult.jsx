import { useMemo } from 'react';

import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';
import {
  BlockResponseDataType,
  QuizBlockAnswerType,
  QuizBlockDataType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import AnswersResult from './AnswerResult';
import { verifyAnswers } from './utils';
import { CheckboxText } from '../QuizAnswer/QuizAnswer.styled';
import * as S from './QuizResult.styled';

const QuizResult = ({ answer, data, reply }) => {
  const newData = {
    question: data.question,
    answers: data.answers.map((x, i) => ({
      ...x,
      correct: reply.response[i],
    })),
  };
  const { question, answers } = newData;

  const options = answers?.map(({ value, correct }, i) => ({
    label: <CheckboxText>{htmlToReact(value)}</CheckboxText>,
    value: i,
    correct,
  }));

  const { correct, result } = verifyAnswers(answers, answer?.results);

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
  answer: QuizBlockAnswerType,
  reply: BlockResponseDataType,
};

export default QuizResult;
