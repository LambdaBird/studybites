import { BlockElementProps } from './utils';
import Paragraph from './Paragraph';
import QuizBlockResult from './QuizBlockResult';
import Embed from './Embed';
import Image from './Image';
import List from './List';
import Header from './Header';
import Quote from './Quote';
import Delimiter from './Delimiter';
import Table from './Table';
import Error from './Error';

const BlockElement = ({ element }) => {
  const { content, answer } = element;
  switch (content.type) {
    case 'paragraph':
      return <Paragraph {...element} />;
    case 'quiz':
      return <QuizBlockResult correctAnswer={answer} data={content?.data} />;
    case 'embed':
      return <Embed {...element} />;
    case 'image':
      return <Image {...element} />;
    case 'list':
      return <List {...element} />;
    case 'header':
      return <Header {...element} />;
    case 'quote':
      return <Quote {...element} />;
    case 'delimiter':
      return <Delimiter {...element} />;
    case 'table':
      return <Table {...element} />;
    default:
      return <Error />;
  }
};

BlockElement.propTypes = BlockElementProps;

export default BlockElement;
