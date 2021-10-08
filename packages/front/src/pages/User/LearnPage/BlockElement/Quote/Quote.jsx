import { Typography } from 'antd';

import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import { QuoteContentType } from '../types';

import * as S from './Quote.styled';

const { Text } = Typography;

const Quote = ({ content }) => {
  const { alignment, caption, text } = content.data;
  return (
    <S.Quote>
      <blockquote>{htmlToReact(text)}</blockquote>
      <S.QuoteAuthor alignment={alignment}>
        <Text>{htmlToReact(caption)}</Text>
      </S.QuoteAuthor>
    </S.Quote>
  );
};

Quote.propTypes = {
  content: QuoteContentType,
};

export default Quote;
