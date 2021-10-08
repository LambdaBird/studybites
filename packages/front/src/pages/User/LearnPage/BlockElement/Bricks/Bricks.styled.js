import { Button, Typography } from 'antd';
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

export const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
  @media (max-width: 767px) {
    margin-top: auto;
  }
  display: flex;
  justify-content: flex-end;
`;

export const Description = styled(Text)`
  color: rgba(0, 0, 0, 0.45);
`;

export const Question = styled.div`
  margin: 1rem 0;
`;
