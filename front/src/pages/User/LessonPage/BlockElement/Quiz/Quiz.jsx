import {
  BlockContentType,
  BlockIdType,
  QuizBlockAnswerType,
  RevisionType,
} from '@sb-ui/pages/User/LessonPage/BlockElement/types';

import QuizAnswer from './QuizAnswer';
import QuizResult from './QuizResult';

const Quiz = ({ blockId, revision, answer, content }) => {
  if (!answer) {
    return (
      <QuizAnswer blockId={blockId} revision={revision} {...content?.data} />
    );
  }

  return <QuizResult correctAnswer={answer} data={content?.data} />;
};
Quiz.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: QuizBlockAnswerType,
};

export default Quiz;
