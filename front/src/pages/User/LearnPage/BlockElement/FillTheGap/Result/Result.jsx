import { Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import {
  CORRECT_ALL,
  CORRECT_NONE,
  CORRECT_PARTIAL,
  verifyAnswers,
} from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/utils';
import {
  FillTheGapBlockAnswerType,
  FillTheGapBlockDataType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import * as S from './Result.styled';

const { Text } = Typography;

const Result = ({ correctAnswer, data }) => {
  const { t } = useTranslation('user');
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
        {correct === CORRECT_ALL ? (
          <S.AnswerWrapper>
            <Text>{t('lesson.answer_result.correct')}</Text>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          </S.AnswerWrapper>
        ) : (
          <>
            {correct === CORRECT_PARTIAL && (
              <S.AnswerWrapper>
                <Text>{t('lesson.answer_result.partially_wrong')}</Text>
                <S.WarningTwoTone twoToneColor="#FADB14" />
              </S.AnswerWrapper>
            )}
            {correct === CORRECT_NONE && (
              <S.AnswerWrapper>
                <Text>{t('lesson.answer_result.wrong')}</Text>
                <CloseCircleTwoTone twoToneColor="#F5222D" />
              </S.AnswerWrapper>
            )}
            <S.ResultWrapper>
              <Text italic>
                {chunks.map((chunk, index) => {
                  if (index === chunks.length - 1) {
                    return <span>{chunk}</span>;
                  }
                  const { value, correct: correctValue } = result[index];
                  return (
                    <>
                      <span>{chunk}</span>
                      {correctValue ? (
                        <S.CorrectSpan>{value}</S.CorrectSpan>
                      ) : (
                        <S.WrongSpan>{value}</S.WrongSpan>
                      )}
                    </>
                  );
                })}
              </Text>
            </S.ResultWrapper>
          </>
        )}
      </ChunkWrapper>
    </>
  );
};

Result.propTypes = {
  data: FillTheGapBlockDataType,
  correctAnswer: FillTheGapBlockAnswerType,
};

export default Result;
