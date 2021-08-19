import {
  BlockContentType,
  BlockIdType,
  BlockResponseDataType,
  QuizBlockAnswerType,
  QuizBlockReplyType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import QuizAnswer from './QuizAnswer';
import QuizResult from './QuizResult';

const Quiz = ({ blockId, revision, answer, content, reply }) => {
  if (!answer) {
    return (
      <QuizAnswer blockId={blockId} revision={revision} {...content?.data} />
    );
  }
  return <QuizResult answer={answer} data={content.data} reply={reply} />;
};
Quiz.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: QuizBlockAnswerType,
  data: BlockResponseDataType,
  reply: QuizBlockReplyType,
};

export default Quiz;
