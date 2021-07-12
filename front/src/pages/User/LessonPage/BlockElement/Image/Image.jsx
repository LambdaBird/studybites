import { Col, Row, Typography } from 'antd';
import PropTypes from 'prop-types';

import { BlockElementProps } from '../types';

const { Text } = Typography;

const Image = ({ content, blockId }) => {
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
};

Image.propTypes = {
  ...BlockElementProps,
  content: {
    ...BlockElementProps.content,
    data: PropTypes.shape({
      caption: PropTypes.string,
      url: PropTypes.string,
    }),
  },
};

export default Image;
