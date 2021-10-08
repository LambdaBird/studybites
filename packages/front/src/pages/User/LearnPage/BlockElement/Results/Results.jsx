import { Statistic, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { verifyAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/verifyAnswers';
import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import * as S from './Results.styled';

const { Text, Title } = Typography;

const interactiveAnswerTypes = [BLOCKS_TYPE.QUIZ, BLOCKS_TYPE.CLOSED_QUESTION];

const Results = ({ callbackRef }) => {
  const { t } = useTranslation('user');
  const { chunks } = useContext(LearnContext);

  const interactiveAnswerBlocks = useMemo(
    () =>
      chunks
        ?.flat()
        ?.filter((block) => interactiveAnswerTypes.includes(block.type)) || [],
    [chunks],
  );

  const correctInteractiveAnswer = useMemo(
    () =>
      interactiveAnswerBlocks
        .map(({ type, reply, answer, content }) => {
          if (type === BLOCKS_TYPE.QUIZ) {
            const userAnswer =
              reply?.response?.map((x) => ({ correct: x })) ||
              content?.data?.answers;
            const { correct } = verifyAnswers(userAnswer, answer?.results);
            return correct;
          }
          if (type === BLOCKS_TYPE.CLOSED_QUESTION) {
            const userAnswer = content?.data?.answer;
            return answer?.results?.some(
              (result) =>
                result.trim().toLowerCase() ===
                userAnswer?.trim()?.toLowerCase(),
            );
          }
          return false;
        })
        .filter((x) => x)?.length,
    [interactiveAnswerBlocks],
  );

  const percentCorrect = useMemo(
    () => (correctInteractiveAnswer / interactiveAnswerBlocks.length) * 100,
    [correctInteractiveAnswer, interactiveAnswerBlocks.length],
  );

  return (
    <S.Row ref={callbackRef}>
      <S.Col>
        <Title level={3}>{t('lesson.results.title')}</Title>
      </S.Col>
      <S.Col>
        <Statistic
          title={t('lesson.results.correct_answers')}
          value={correctInteractiveAnswer}
        />
      </S.Col>
      <S.Col>
        <Statistic
          title={t('lesson.results.total_answers')}
          value={interactiveAnswerBlocks.length}
        />
      </S.Col>
      {interactiveAnswerBlocks.length > 0 && (
        <S.Col>
          <Text strong>
            {t('lesson.results.percentage', {
              percentage: percentCorrect.toFixed(),
            })}
          </Text>
        </S.Col>
      )}
    </S.Row>
  );
};

Results.propTypes = {
  callbackRef: PropTypes.func,
};

export default Results;
