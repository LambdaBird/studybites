import { Typography } from 'antd';
import { BlockElementProps } from '../utils';
import * as S from './Quote.styled';

const { Text } = Typography;

const Quote = ({ content }) => {
  const { alignment, caption, text } = content.data;
  return (
    <S.Quote>
      <blockquote>{text}</blockquote>
      <S.QuoteAuthor alignment={alignment}>
        <Text>{caption}</Text>
      </S.QuoteAuthor>
    </S.Quote>
  );
};

Quote.propTypes = BlockElementProps;

export default Quote;
