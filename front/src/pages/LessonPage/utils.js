import { Col, Row, Typography } from 'antd';
import QuizBlock from '@sb-ui/pages/LessonPage/QuizBlock';

const { Text } = Typography;

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
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Text key={blockId} type="secondary">
        {content?.data?.text}
      </Text>
    );
  }

  if (content.type === 'quiz') {
    if (content.data?.answers?.some((x) => x.correct !== undefined)) {
      return <QuizBlock correctAnswer={answer} isResult data={content?.data} />;
    }
    return null;
  }

  if (content.type === 'image') {
    const { caption, url, stretched } = content?.data || {};
    return (
      <Row key={blockId}>
        <Col span={24}>
          <img width={stretched ? '100%' : undefined} src={url} alt={caption} />
        </Col>
        {caption && (
          <Col span={24}>
            <Text type="">{caption}</Text>
          </Col>
        )}
      </Row>
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
