import { Button, Typography } from 'antd';
import styled from 'styled-components';

import { RightOutlinedAntd } from '@sb-ui/components/Icons';
import variables from '@sb-ui/theme/variables';

import { BlockElementWrapperWhite } from '../../BlockElement.styled';

const { Text } = Typography;

export const Question = styled(Text)`
  font-style: italic;
`;

export const BlockWrapperWhite = styled(BlockElementWrapperWhite)`
  align-items: center;
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
