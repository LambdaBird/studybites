import { Col, Row, Typography } from 'antd';
import HtmlToReact from 'html-to-react';
import QuizBlockResult from '@sb-ui/pages/LessonPage/QuizBlockResult';
import * as S from '@sb-ui/pages/LessonPage/LessonPage.styled';

const HtmlToReactParser = HtmlToReact.Parser;

const { Text, Title } = Typography;

export const groupBlocks = (lessons) => {
  const res = [];
  let lastIndex = 0;
  lessons?.forEach((value, i) => {
    if (value?.content?.type === 'next') {
      res.push(lessons.slice(lastIndex, i));
      lastIndex = i + 1;
    } else if (value?.content?.type === 'quiz') {
      res.push(lessons.slice(lastIndex, i));
      res.push(lessons.slice(i, i + 1));
      lastIndex = i + 1;
    }
  });
  if (lastIndex === 0 && lessons.length !== 0) {
    return [lessons];
  }
  if (lastIndex !== lessons?.length) {
    res.push(lessons.slice(lastIndex));
  }
  return res;
};

export const generateBlockByElement = (element) => {
  const { content, blockId, answer } = element;
  if (content.type === 'paragraph') {
    const htmlInput = content?.data?.text;
    const htmlToReactParser = new HtmlToReactParser();
    return htmlToReactParser.parse(htmlInput);
  }

  if (content.type === 'quiz') {
    if (content.data?.answers?.some((x) => x.correct !== undefined)) {
      // eslint-disable-next-line react/jsx-filename-extension
      return <QuizBlockResult correctAnswer={answer} data={content?.data} />;
    }
    return null;
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
          {items.map((item) => (
            <li>{item}</li>
          ))}
        </ol>
      );
    }

    if (style === 'unordered') {
      return (
        <ul>
          {items.map((item) => (
            <li>{item}</li>
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
      <S.CustomTableWrapper
        style={{ backgroundColor: 'white', padding: '1rem' }}
      >
        <S.CustomTable>
          {contentTable.map((row) => (
            <tr>
              {row.map((col) => (
                <td>{col}</td>
              ))}
            </tr>
          ))}
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

export const prepareResultToAnswers = (data) => ({
  ...data,
  lesson: {
    ...data?.lesson,
    blocks: data?.lesson?.blocks.map((x) => ({
      ...x,
      content: {
        ...x.content,
        data: {
          ...x.content.data,
          answers:
            x.type === 'quiz'
              ? x.content.data.answers.map((y, j) => ({
                  ...y,
                  correct: x.data?.response?.[j],
                }))
              : x.content.data.answers,
        },
      },
    })),
  },
});
