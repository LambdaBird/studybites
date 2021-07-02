import { Col, Row, Typography } from 'antd';
import HtmlToReact from 'html-to-react';
import PropTypes from 'prop-types';
import QuizBlockResult from '@sb-ui/pages/User/LessonPage/BlockElement/QuizBlockResult';
import * as S from './BlockElement.styled';

const HtmlToReactParser = HtmlToReact.Parser;

const { Text, Title } = Typography;

const BlockElement = ({ element }) => {
  const { content, blockId, answer } = element;
  if (content.type === 'paragraph') {
    const htmlInput = content?.data?.text;
    const htmlToReactParser = new HtmlToReactParser();
    return htmlToReactParser.parse(htmlInput);
  }

  if (content.type === 'quiz') {
    return <QuizBlockResult correctAnswer={answer} data={content?.data} />;
  }

  if (content.type === 'embed') {
    const { caption, embed, height } = content.data;
    return (
      <Row>
        <Col span={24}>
          <embed height={height} width="100%" title={caption} src={embed} />
        </Col>
        {caption && (
          <Col span={24}>
            <Text type="">{caption}</Text>
          </Col>
        )}
      </Row>
    );
  }

  if (content.type === 'image') {
    const { caption, url } = content?.data || {};
    return (
      <Row key={blockId}>
        <Col span={24}>
          <img width="100%" src={url} alt={caption} />
        </Col>
        {caption && (
          <Col span={24}>
            <Text type="">{caption}</Text>
          </Col>
        )}
      </Row>
    );
  }

  if (content.type === 'list') {
    const { style, items } = content.data;
    if (style === 'ordered') {
      return (
        <ol>
          {items.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index}>{item}</li>
          ))}
        </ol>
      );
    }

    if (style === 'unordered') {
      return (
        <ul>
          {items.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
  }

  if (content.type === 'header') {
    const { text, level } = content.data;
    return <Title level={level}>{text}</Title>;
  }

  if (content.type === 'quote') {
    const { alignment, caption, text } = content.data;
    return (
      <S.Quote>
        <blockquote>{text}</blockquote>
        <S.QuoteAuthor alignment={alignment}>
          <Text>{caption}</Text>
        </S.QuoteAuthor>
      </S.Quote>
    );
  }

  if (content.type === 'delimiter') {
    return <S.Delimiter />;
  }

  if (content.type === 'table') {
    const contentTable = content.data.content;
    return (
      <S.CustomTableWrapper>
        <S.CustomTable>
          <thead />
          <tbody>
            {contentTable.map((row, rowIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={rowIndex}>
                {row.map((col, colIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <td key={`${rowIndex}-${colIndex}`}>{col}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </S.CustomTable>
      </S.CustomTableWrapper>
    );
  }

  return (
    <Text key={blockId} type="danger">
      ERROR PARSE BLOCK
    </Text>
  );
};

BlockElement.propTypes = {
  element: PropTypes.shape({
    content: PropTypes.shape({
      type: PropTypes.string.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      data: PropTypes.object.isRequired,
    }).isRequired,
    blockId: PropTypes.string.isRequired,
    answer: PropTypes.shape({
      results: PropTypes.arrayOf(PropTypes.bool),
    }),
  }),
};
export default BlockElement;
