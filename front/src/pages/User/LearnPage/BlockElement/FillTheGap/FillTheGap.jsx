import {
  BlockContentType,
  BlockIdType,
  FillTheGapBlockAnswerType,
  FillTheGapBlockDataType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import Answer from './Answer';
import Result from './Result';

const FillTheGap = ({ blockId, revision, answer, content, data }) => {
  if (!answer) {
    return <Answer blockId={blockId} revision={revision} {...content?.data} />;
  }
  const newData = {
    text: content.data.text,
    answers: content.data.answers,
  };
  if (data?.response !== undefined) {
    newData.answers = data.response;
  }
  return <Result correctAnswer={answer} data={newData} />;
};

FillTheGap.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: FillTheGapBlockAnswerType,
  data: FillTheGapBlockDataType,
};

export default FillTheGap;
