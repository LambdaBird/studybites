import { useMemo } from 'react';

import {
  FillTheGapBlockAnswerType,
  FillTheGapBlockDataType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import { verifyAnswers } from '../verifyAnswers';

import AnswerResult from './AnswerResult';
import * as S from './Result.styled';

const Result = ({ correctAnswer, data }) => {
  const { text, answers } = data;
  const { results } = correctAnswer;
  const chunks = useMemo(() => text?.split('{{ # }}'), [text]);

  const { correct, result } = verifyAnswers(results, answers);
  return (
    <>
      <ChunkWrapper>
        <S.ChunkText>
          {chunks.map((chunk, index) => {
            if (index === chunks.length - 1) {
              return <span>{chunk}</span>;
            }
            return (
              <>
                <span>{chunk}</span>
                <S.Input value={answers[index]} />
              </>
            );
          })}
        </S.ChunkText>
      </ChunkWrapper>
      <ChunkWrapper>
        <AnswerResult correct={correct} result={result} chunks={chunks} />
      </ChunkWrapper>
    </>
  );
};

Result.propTypes = {
  data: FillTheGapBlockDataType,
  correctAnswer: FillTheGapBlockAnswerType,
};

export default Result;
