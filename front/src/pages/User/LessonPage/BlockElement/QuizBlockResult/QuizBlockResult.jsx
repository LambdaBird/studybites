import PropTypes from 'prop-types';

import { verifyAnswers } from '@sb-ui/pages/User/LessonPage/QuizBlock/utils';
import GroupBlock from '@sb-ui/pages/User/LessonPage/GroupBlock';
import Question from './Question';
import AnswersResult from './AnswerResult';
import Answer from './Answer';

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
  correctAnswer: PropTypes.shape({
    results: PropTypes.arrayOf(PropTypes.bool).isRequired,
  }),
  data: PropTypes.shape({
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
      }),
    ).isRequired,
    question: PropTypes.string.isRequired,
  }),
};

export default QuizBlockResult;
