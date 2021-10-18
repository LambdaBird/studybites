import { useMemo } from 'react';

import * as S from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/Quiz.styled';
import {
  ClosedQuestionBlockAnswerType,
  ClosedQuestionBlockDataType,
  ClosedQuestionBlockReplyType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import AnswerResult from './AnswerResult';
import { verifyAnswers } from './verifyAnswers';

const Result = ({ answer, data, reply }) => {
  const { question } = data;
  const { results, explanation } = answer;
  const { value: userValue } = reply;

  const isCorrect = useMemo(
    () => verifyAnswers(results, userValue),
    [results, userValue],
  );

  return (
    <>
      <ChunkWrapper>
        <S.Question>{question}</S.Question>
      </ChunkWrapper>
      <ChunkWrapper>{userValue}</ChunkWrapper>
      <ChunkWrapper>
        <AnswerResult
          correct={isCorrect}
          results={results}
          explanation={explanation}
        />
      </ChunkWrapper>
    </>
  );
};
Result.propTypes = {
  data: ClosedQuestionBlockDataType,
  answer: ClosedQuestionBlockAnswerType,
  reply: ClosedQuestionBlockReplyType,
};

export default Result;
