import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import {
  ArrowConnectImg,
  MatchLine,
  MatchWrapper,
} from '@sb-ui/pages/User/LearnPage/BlockElement/Match/Answer/Answer.styled';
import { verifyAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/Match/Result/utils';
import {
  MatchBlockAnswerType,
  MatchBlockDataType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import * as S from './Result.styled';

const { Text } = Typography;

const Result = ({ correctAnswer, data }) => {
  const { t } = useTranslation('user');
  const { correct, results } = verifyAnswers(
    correctAnswer?.results,
    data?.answer,
  );
  return (
    <>
      <ChunkWrapper>
        <MatchWrapper>
          {results?.map(({ correct: correctResult, from, to }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <MatchLine key={index}>
              <S.MatchBlock correct={correctResult}>{from}</S.MatchBlock>
              <ArrowConnectImg />
              <S.MatchBlock correct={correctResult}>{to}</S.MatchBlock>
            </MatchLine>
          ))}
        </MatchWrapper>
      </ChunkWrapper>
      <ChunkWrapper>
        {correct ? (
          <S.AnswerWrapper>
            <Text>{t('lesson.answer_result.correct')}</Text>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          </S.AnswerWrapper>
        ) : (
          <>
            <S.AnswerWrapperWrong>
              <S.AnswerWrapperWrongTitle>
                <Text>{t('lesson.answer_result.wrong')}</Text>
                <CloseCircleTwoTone twoToneColor="#F5222D" />
              </S.AnswerWrapperWrongTitle>
              <MatchWrapper>
                {correctAnswer?.results?.map(({ from, to }, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <MatchLine key={index}>
                    <S.MatchBlockResult>{from}</S.MatchBlockResult>
                    <ArrowConnectImg />
                    <S.MatchBlockResult>{to}</S.MatchBlockResult>
                  </MatchLine>
                ))}
              </MatchWrapper>
            </S.AnswerWrapperWrong>
          </>
        )}
      </ChunkWrapper>
    </>
  );
};

Result.propTypes = {
  data: MatchBlockDataType,
  correctAnswer: MatchBlockAnswerType,
};

export default Result;
