import { Typography } from 'antd';

import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import { EmbedContentType } from '../types';

import * as S from './Embed.styled';

const { Text } = Typography;

const Embed = ({ content }) => {
  const { caption, embed, height } = content.data;
  return (
    <S.Row>
      <S.Col>
        <S.StyledIframe
          height={height}
          width="100%"
          title={caption}
          src={embed}
          allowFullScreen
        />
      </S.Col>
      {caption && (
        <S.Col>
          <Text>{htmlToReact(caption)}</Text>
        </S.Col>
      )}
    </S.Row>
  );
};

Embed.propTypes = {
  content: EmbedContentType,
};

export default Embed;
