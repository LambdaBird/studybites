import Delimiter from './Delimiter';
import Embed from './Embed';
import Error from './Error';
import Finish from './Finish';
import Finished from './Finished';
import Header from './Header';
import Image from './Image';
import List from './List';
import Next from './Next';
import Paragraph from './Paragraph';
import Quiz from './Quiz';
import Quote from './Quote';
import Start from './Start';
import Table from './Table';
import { BlockElementProps, BLOCKS_TYPE } from './types';

const BlockElement = ({ element }) => {
  switch (element.content.type) {
    case BLOCKS_TYPE.PARAGRAPH:
      return <Paragraph {...element} />;
    case BLOCKS_TYPE.QUIZ:
      return <Quiz {...element} />; //
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
    case BLOCKS_TYPE.DELIMITER:
      return <Delimiter {...element} />;
    case BLOCKS_TYPE.TABLE:
      return <Table {...element} />;
    case BLOCKS_TYPE.NEXT:
      return <Next {...element} />;
    case BLOCKS_TYPE.FINISH:
      return <Finish {...element} />;
    case BLOCKS_TYPE.START:
      return <Start {...element} />;
    case BLOCKS_TYPE.FINISHED:
      return <Finished />;
    default:
      return <Error />;
  }
};

BlockElement.propTypes = BlockElementProps;

export default BlockElement;