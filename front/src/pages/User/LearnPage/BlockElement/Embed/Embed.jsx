import { Col, Row, Typography } from 'antd';

import { EmbedContentType } from '../types';

import * as S from './Embed.styled';

const { Text } = Typography;

const Embed = ({ content }) => {
  const { caption, embed, height } = content.data;
  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <S.StyledIframe
          height={height}
          width="100%"
          title={caption}
          src={embed}
          allowFullScreen
        />
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
