import {
  BlockContentType,
  BlockIdType,
  ClosedQuestionBlockAnswerType,
  ClosedQuestionBlockReplyType,
  ClosedQuestionResponseDataType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import Answer from './Answer';
import Result from './Result';

const ClosedQuestion = ({ blockId, revision, answer, content, reply }) => {
  if (!answer) {
    return <Answer blockId={blockId} revision={revision} {...content?.data} />;
  }
  return <Result answer={answer} data={content.data} reply={reply} />;
};

ClosedQuestion.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: ClosedQuestionBlockAnswerType,
  data: ClosedQuestionResponseDataType,
  reply: ClosedQuestionBlockReplyType,
};

export default ClosedQuestion;
