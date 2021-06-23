import { Typography } from 'antd';
import config from '../../utils/api/config';

const { interactiveBlocks } = config;

const { Text } = Typography;

export const groupBlocks = (lessons) => {
  const res = [];
  let lastIndex = 0;
  lessons?.forEach((value, i) => {
    if (interactiveBlocks.includes(value?.content?.type)) {
      res.push(lessons.slice(lastIndex, i));
      lastIndex = i + 1;
    }
  });
  return res;
};

export const generateBlockByElement = (element) => {
  const { content } = element;
  if (content.type === 'paragraph') {
    // eslint-disable-next-line react/jsx-filename-extension
    return <Text type="secondary">{content?.data?.text}</Text>;
  }
  return <Text type="danger">ERROR PARSE BLOCK</Text>;
};
