import { useTranslation } from 'react-i18next';

import * as S from '@sb-ui/pages/User/LessonPage/LessonPage.styled';

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
import { BlockElementProps, BLOCKS_TYPE } from './types';


const BlockElement = ({ element }) => {
  const { t } = useTranslation();
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
    case BLOCKS_TYPE.NEXT:
      return !element.response.isSolved ? (
        <S.LessonButton onClick={element.handleNextClick}>
          {t('user:lesson.next')}
        </S.LessonButton>
      ) : null;
    case BLOCKS_TYPE.FINISH:
      return !element.response.isSolved ? (
        <S.LessonButton onClick={element.handleNextClick}>
          Finish
        </S.LessonButton>
      ) : null;
    default:
      return <Error />;
  }
};

BlockElement.propTypes = BlockElementProps;

export default BlockElement;
