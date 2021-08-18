import {
  BlockContentType,
  BlockIdType,
  BlockResponseDataType,
  QuizBlockAnswerType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import QuizAnswer from './QuizAnswer';
import QuizResult from './QuizResult';

const Quiz = ({ blockId, revision, answer, content, data }) => {
  if (!answer) {
    return (
      <QuizAnswer blockId={blockId} revision={revision} {...content?.data} />
    );
  }

  const newData = {
    question: content.data.question,
    answers: content.data.answers,
  };
  if (data?.response) {
    newData.answers = content.data.answers.map((x, i) => ({
      ...x,
      correct: data.response[i],
    }));
  }
  return <QuizResult correctAnswer={answer} data={newData} />;
};
Quiz.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: QuizBlockAnswerType,
  data: BlockResponseDataType,
};

export default Quiz;
