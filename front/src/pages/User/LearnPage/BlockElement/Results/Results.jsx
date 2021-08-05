import { Statistic, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { verifyAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/QuizResult/utils';
import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import * as S from './Results.styled';

const { Text, Title } = Typography;

const Results = ({ callbackRef }) => {
  const { t } = useTranslation('user');
  const { chunks } = useContext(LearnContext);

  const quizBlocks = useMemo(
    () =>
      chunks?.flat()?.filter((block) => block.type === BLOCKS_TYPE.QUIZ) || [],
    [chunks],
  );

  const correctQuiz = useMemo(
    () =>
      quizBlocks
        .map(({ data, answer, content }) => {
          const userAnswer =
            data?.response?.map((x) => ({ correct: x })) ||
            content?.data?.answers;
          const { correct } = verifyAnswers(userAnswer, answer?.results);
          return correct;
        })
        .filter((x) => x)?.length,
    [quizBlocks],
  );

  const percentCorrect = useMemo(
    () => (correctQuiz / quizBlocks.length) * 100,
    [correctQuiz, quizBlocks.length],
  );

  return (
    <S.Row ref={callbackRef}>
      <S.Col>
        <Title level={3}>{t('lesson.results.title')}</Title>
      </S.Col>
      <S.Col>
        <Statistic
          title={t('lesson.results.correct_answers')}
          value={correctQuiz}
        />
      </S.Col>
      <S.Col>
        <Statistic
          title={t('lesson.results.total_answers')}
          value={quizBlocks.length}
        />
      </S.Col>
      {quizBlocks.length > 0 && (
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
