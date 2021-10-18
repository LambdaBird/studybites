import { Button, Checkbox, Typography } from 'antd';
import styled from 'styled-components';

import { BlockElementWrapperWhite } from '../BlockElement.styled';

const { Text } = Typography;

export const AnswerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ColumnCheckbox = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
`;

export const Question = styled(Text)`
  font-style: italic;
`;

export const BlockWrapperWhite = styled(BlockElementWrapperWhite)`
  flex-direction: column;
`;

export const LessonButtonSend = styled(Button).attrs({
  size: 'large',
})`
  width: 100%;
  @media (max-width: 767px) {
    width: 150px;
  }

  margin-bottom: 1rem;
`;

export const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

export const CheckboxText = styled.span`
  overflow-wrap: anywhere;
`;
