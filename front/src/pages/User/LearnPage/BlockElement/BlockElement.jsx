import PropTypes from 'prop-types';

import Attach from './Attach';
import Bricks from './Bricks';
import ClosedQuestion from './ClosedQuestion';
import Code from './Code';
import Delimiter from './Delimiter';
import Embed from './Embed';
import Error from './Error';
import FillTheGap from './FillTheGap';
import Finish from './Finish';
import GradedQuestion from './GradedQuestion';
import Header from './Header';
import Image from './Image';
import List from './List';
import Match from './Match';
import Next from './Next';
import Paragraph from './Paragraph';
import Quiz from './Quiz';
import Quote from './Quote';
import Start from './Start';
import Table from './Table';
import {
  BlockContentType,
  BlockIdType,
  BLOCKS_TYPE,
  ClosedQuestionBlockAnswerType,
  QuizBlockAnswerType,
} from './types';
import Warning from './Warning';

const BlockElement = ({ element }) => {
  switch (element.content.type) {
    case BLOCKS_TYPE.ATTACH:
      return <Attach {...element} />;
    case BLOCKS_TYPE.PARAGRAPH:
      return <Paragraph {...element} />;
    case BLOCKS_TYPE.QUIZ:
      return <Quiz {...element} />; //
    case BLOCKS_TYPE.WARNING:
      return <Warning {...element} />;
    case BLOCKS_TYPE.CODE:
      return <Code {...element} />;
    case BLOCKS_TYPE.EMBED:
      return <Embed {...element} />;
    case BLOCKS_TYPE.IMAGE:
      return <Image {...element} />;
    case BLOCKS_TYPE.LIST:
      return <List {...element} />;
    case BLOCKS_TYPE.HEADER:
      return <Header {...element} />;
    case BLOCKS_TYPE.QUOTE:
      return <Quote {...element} />;
    case BLOCKS_TYPE.CLOSED_QUESTION:
      return <ClosedQuestion {...element} />;
    case BLOCKS_TYPE.GRADED_QUESTION:
      return <GradedQuestion {...element} />;
    case BLOCKS_TYPE.FILL_THE_GAP:
      return <FillTheGap {...element} />;
    case BLOCKS_TYPE.DELIMITER:
      return <Delimiter {...element} />;
    case BLOCKS_TYPE.TABLE:
      return <Table {...element} />;
    case BLOCKS_TYPE.MATCH:
      return <Match {...element} />;
    case BLOCKS_TYPE.BRICKS:
      return <Bricks {...element} />;
    case BLOCKS_TYPE.NEXT:
      return <Next {...element} />;
    case BLOCKS_TYPE.FINISH:
      return <Finish {...element} />;
    case BLOCKS_TYPE.START:
      return <Start {...element} />;
    default:
      return <Error />;
  }
};

BlockElement.propTypes = {
  element: PropTypes.shape({
    content: BlockContentType,
    blockId: BlockIdType,
    answer: PropTypes.oneOfType([
      QuizBlockAnswerType,
      ClosedQuestionBlockAnswerType,
    ]),
  }),
};

export default BlockElement;
