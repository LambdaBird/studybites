import { Col, Row, Typography } from 'antd';

import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import { BlockIdType, ImageContentType } from '../types';

import * as S from './Image.styled';

const { Text } = Typography;

const Image = ({ content, blockId }) => {
  const { caption, location } = content?.data || {};
  return (
    <Row key={blockId}>
      <Col span={24}>
        <S.Image src={location} alt={caption} />
      </Col>
      {caption && (
        <Col span={24}>
          <Text>{htmlToReact(caption)}</Text>
        </Col>
      )}
    </Row>
  );
};

Image.propTypes = {
  blockId: BlockIdType,
  content: ImageContentType,
};

export default Image;
