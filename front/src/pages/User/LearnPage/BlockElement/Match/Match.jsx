import {
  BlockContentType,
  BlockIdType,
  MatchBlockAnswerType,
  MatchResponseDataType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import Answer from './Answer';
import Result from './Result';

const Match = ({ blockId, revision, answer, content, data }) => {
  if (!answer) {
    return <Answer blockId={blockId} revision={revision} {...content?.data} />;
  }

  const newData = {
    answer: content.data.answer,
  };
  if (data?.response) {
    newData.answer = data.response;
  }
  return <Result correctAnswer={answer} data={newData} />;
};

Match.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: MatchBlockAnswerType,
  data: MatchResponseDataType,
};

export default Match;
