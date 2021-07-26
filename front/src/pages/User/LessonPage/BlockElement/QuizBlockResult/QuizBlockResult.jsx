import GroupBlock from '@sb-ui/pages/User/LessonPage/GroupBlock';
import { verifyAnswers } from '@sb-ui/pages/User/LessonPage/QuizBlock/utils';

import { QuizBlockAnswerType, QuizBlockDataType } from '../types';

import Answer from './Answer';
import AnswersResult from './AnswerResult';
import Question from './Question';

const QuizBlockResult = ({ data, correctAnswer }) => {
  const { answers, question } = data;

  const options = answers?.map(({ value, correct }, i) => ({
    label: value,
    value: i,
    correct,
  }));

  const { correct, difference } = verifyAnswers(
    answers.map((x) => x.correct),
    correctAnswer?.results,
  );

  return (
    <>
      <GroupBlock elements={[<Question text={question} />]} />
      <GroupBlock elements={[<Answer options={options} />]} top="1rem" />
      <GroupBlock
        elements={[
          <AnswersResult
            difference={difference}
            options={options}
            correct={correct}
          />,
        ]}
        top="1rem"
        padding="1rem 2rem"
      />
    </>
  );
};

QuizBlockResult.propTypes = {
  data: QuizBlockDataType,
  correctAnswer: QuizBlockAnswerType,
};

export default QuizBlockResult;