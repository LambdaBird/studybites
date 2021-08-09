import { Button, Row, Typography } from 'antd';
import styled from 'styled-components';
import { RightOutlined as RightOutlinedAntd } from '@ant-design/icons';

import variables from '@sb-ui/theme/variables';

const { Text } = Typography;

export const BlockWrapperWhite = styled(Row)`
  width: 100%;
  background-color: white;
  box-shadow: 0px -4px 10px rgba(231, 231, 231, 0.5);
  border-radius: 8px;
  max-width: 614px;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  @media (max-width: 767px) {
    max-width: none;
    overflow-x: hidden;
    width: 100vw;
  }
`;

export const Question = styled(Text)`
  font-style: italic;
`;

export const Textarea = styled.textarea.attrs({
  rows: 2,
})`
  flex: 1;
  outline: none;
  border: none;
  word-break: break-word;
  resize: none;
`;

export const SendButton = styled(Button).attrs({
  type: 'secondary',
  shape: 'circle',
  size: 'medium',
})`
  flex: 0;
  border: 0;
  background-color: ${variables['button-send-background']};
`;

export const RightOutlined = styled(RightOutlinedAntd)`
  color: ${variables['button-send-color']};
`;
