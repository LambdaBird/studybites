import { Statistic, Typography } from 'antd';
import { useContext, useMemo } from 'react';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { verifyAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/QuizResult/utils';
import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import * as S from './Results.styled';

const { Text, Title } = Typography;

const Results = () => {
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
    <S.Row>
      <S.Col>
        <Title level={3}>Results</Title>
      </S.Col>
      <S.Col>
        <Statistic title="Correct answers in the lesson" value={correctQuiz} />
      </S.Col>
      <S.Col>
        <Statistic
          title="Total questions in the chapter"
          value={quizBlocks.length}
        />
      </S.Col>
      {quizBlocks.length > 0 && (
        <S.Col>
          <Text strong>{percentCorrect.toFixed()}% correct answers</Text>
        </S.Col>
      )}
    </S.Row>
  );
};

export default Results;
