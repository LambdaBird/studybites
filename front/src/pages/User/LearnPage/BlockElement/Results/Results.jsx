import { Statistic, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { chunksToInteractiveBlocks } from '@sb-ui/pages/User/LearnPage/BlockElement/Results/chunksToInteractiveBlocks';
import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import {
  interactiveGradedResultTypesBlocks,
  interactiveResultTypesBlocks,
} from '@sb-ui/utils/api/config';

import {
  calculateBricks,
  calculateClosedQuestion,
  calculateFillTheGap,
  calculateMatch,
  calculateQuiz,
} from './calculateAnswer';
import * as S from './Results.styled';

const { Text, Title } = Typography;

const Results = ({ callbackRef }) => {
  const { t } = useTranslation('user');
  const { chunks } = useContext(LearnContext);

  const interactiveAnswerBlocks = useMemo(
    () => chunksToInteractiveBlocks(chunks, interactiveResultTypesBlocks),
    [chunks],
  );

  const interactiveGradedBlocks = useMemo(
    () => chunksToInteractiveBlocks(chunks, interactiveGradedResultTypesBlocks),
    [chunks],
  );

  const correctInteractiveAnswer = useMemo(
    () =>
      interactiveAnswerBlocks
        .map(({ type, ...block }) => {
          switch (type) {
            case BLOCKS_TYPE.QUIZ:
              return calculateQuiz(block);
            case BLOCKS_TYPE.CLOSED_QUESTION:
              return calculateClosedQuestion(block);
            case BLOCKS_TYPE.FILL_THE_GAP:
              return calculateFillTheGap(block);
            case BLOCKS_TYPE.BRICKS:
              return calculateBricks(block);
            case BLOCKS_TYPE.MATCH:
              return calculateMatch(block);
            default:
              return false;
          }
        })
        .filter((x) => x)?.length,
    [interactiveAnswerBlocks],
  );

  const percentCorrect = useMemo(
    () => (correctInteractiveAnswer / interactiveAnswerBlocks.length) * 100,
    [correctInteractiveAnswer, interactiveAnswerBlocks.length],
  );

  const gradedPendingCount = interactiveGradedBlocks.length;

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
      {gradedPendingCount > 0 && (
        <S.Col>
          <Statistic
            title={t('lesson.results.graded_pending')}
            value={gradedPendingCount}
          />
        </S.Col>
      )}

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
