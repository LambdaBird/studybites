import { useMemo } from 'react';

import * as S from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/QuizResult/QuizResult.styled';
import {
  ClosedQuestionBlockAnswerType,
  ClosedQuestionBlockDataType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import AnswerResult from './AnswerResult';

const Result = ({ correctAnswer, data }) => {
  const { question, answer } = data;
  const results = correctAnswer?.results;

  const isCorrect = useMemo(
    () =>
      results?.some(
        (result) =>
          result?.trim()?.toLowerCase() === answer.trim().toLowerCase(),
      ),
    [answer, results],
  );

  return (
    <>
      <ChunkWrapper>
        <S.Question>{question}</S.Question>
      </ChunkWrapper>
      <ChunkWrapper>{answer}</ChunkWrapper>
      <ChunkWrapper>
        <AnswerResult correct={isCorrect} results={results} />
      </ChunkWrapper>
    </>
  );
};
Result.propTypes = {
  data: ClosedQuestionBlockDataType,
  correctAnswer: ClosedQuestionBlockAnswerType,
};

export default Result;
