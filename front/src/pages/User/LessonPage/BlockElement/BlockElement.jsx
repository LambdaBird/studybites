import Delimiter from './Delimiter';
import Embed from './Embed';
import Error from './Error';
import Header from './Header';
import Image from './Image';
import List from './List';
import Paragraph from './Paragraph';
import QuizBlockResult from './QuizBlockResult';
import Quote from './Quote';
import Table from './Table';
import { BlockElementProps } from './types';

const BLOCKS_TYPE = {
  PARAGRAPH: 'paragraph',
  QUIZ: 'quiz',
  EMBED: 'embed',
  IMAGE: 'image',
  LIST: 'list',
  HEADER: 'header',
  QUOTE: 'quote',
  DELIMITER: 'delimiter',
  TABLE: 'table',
};

const BlockElement = ({ element }) => {
  const { content, answer } = element;
  switch (content.type) {
    case BLOCKS_TYPE.PARAGRAPH:
      return <Paragraph {...element} />;
    case BLOCKS_TYPE.QUIZ:
      return <QuizBlockResult correctAnswer={answer} data={content?.data} />;
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
    default:
      return <Error />;
  }
};

BlockElement.propTypes = BlockElementProps;

export default BlockElement;
