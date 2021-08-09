import {
  BlockContentType,
  BlockIdType,
  ClosedQuestionBlockAnswerType,
  ClosedQuestionResponseDataType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import Answer from './Answer';
import Result from './Result';

const ClosedQuestion = ({ blockId, revision, answer, content, data }) => {
  if (!answer) {
    return <Answer blockId={blockId} revision={revision} {...content?.data} />;
  }
  const newData = {
    question: content.data.question,
    answer: content.data.answer,
  };
  if (data?.response !== undefined) {
    newData.answer = data.response;
  }
  return <Result correctAnswer={answer} data={newData} />;
};

ClosedQuestion.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: ClosedQuestionBlockAnswerType,
  data: ClosedQuestionResponseDataType,
};

export default ClosedQuestion;
