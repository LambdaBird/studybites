import { Button, Checkbox, Row, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

export const CheckboxText = styled.span`
  overflow-wrap: anywhere;
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

export const BlockWrapperWhite = styled(Row)`
  width: 100%;
  padding: 2rem 2rem 0 2rem;
  background-color: white;
  box-shadow: 0px -4px 10px rgba(231, 231, 231, 0.5);
  border-radius: 8px;
  max-width: 614px;
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    max-width: none;
    overflow-x: hidden;
    width: 100vw;
  }
`;

export const ColumnCheckbox = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
`;

export const Question = styled(Text)`
  font-style: italic;
`;
