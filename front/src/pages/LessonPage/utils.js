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
  if (lastIndex === 0 && lessons.length !== 0) {
    return [lessons];
  }
  if (lastIndex !== lessons?.length) {
    res.push(lessons.slice(lastIndex));
  }

  return res;
};

export const generateBlockByElement = (element) => {
  const { content, blockId } = element;
  if (content.type === 'paragraph') {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Text key={blockId} type="secondary">
        {content?.data?.text}
      </Text>
    );
  }
  return (
    <Text key={blockId} type="danger">
      ERROR PARSE BLOCK
    </Text>
  );
};
