import { Button, Input as InputAntd, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

export const LessonButton = styled(Button).attrs({
  size: 'large',
})`
  @media (max-width: 767px) {
    margin-top: auto;
  }
  width: 100%;
  margin-bottom: 1rem;
`;

export const Input = styled(InputAntd).attrs({
  type: 'text',
})`
  width: 150px;
`;

export const ChunkText = styled(Text)`
  font-style: italic;
  line-height: 2.5rem;
`;
