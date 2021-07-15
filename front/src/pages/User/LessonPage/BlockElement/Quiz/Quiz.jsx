import {
  BlockContentType,
  QuizBlockAnswerType,
} from '@sb-ui/pages/User/LessonPage/BlockElement/types';

import QuizAnswer from './QuizAnswer';
import QuizResult from './QuizResult';

const Quiz = ({ answer, content }) => {
  if (!answer) {
    return <QuizAnswer {...content?.data} />;
  }

  return <QuizResult correctAnswer={answer} data={content?.data} />;
};
Quiz.propTypes = {
  content: BlockContentType,
  answer: QuizBlockAnswerType,
};

export default Quiz;
