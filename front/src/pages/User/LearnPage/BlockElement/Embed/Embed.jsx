import { Col, Row, Typography } from 'antd';

import { EmbedContentType } from '../types';

const { Text } = Typography;

const Embed = ({ content }) => {
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
};

Embed.propTypes = {
  content: EmbedContentType,
};

export default Embed;
