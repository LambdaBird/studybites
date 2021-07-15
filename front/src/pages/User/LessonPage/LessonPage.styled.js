import { Button, Col, Row, Typography } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

const { Text } = Typography;

export const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const PageRowStart = styled(Row)`
  width: 100%;
  @media (max-width: 767px) {
    margin-top: auto;
  }
`;

export const RowQuiz = styled(Row)`
  @media (max-width: 767px) {
    margin-top: auto;
  }
`;

export const ColQuiz = styled(Col).attrs({
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 16 },
  lg: { span: 14 },
})``;

export const BlockCol = styled(Col).attrs({
  xs: { span: 20 },
  sm: { span: 18 },
  md: { span: 16 },
  lg: { span: 14 },
})`
  display: flex;
  justify-content: center;
  padding-top: 3rem;
`;

export const LessonButton = styled(Button).attrs({
  size: 'large',
})`
  width: 100%;
  max-width: 614px;
  margin-bottom: 1rem;
`;

export const SendWrapper = styled(Col).attrs({
  xs: { span: 20 },
  sm: { span: 18 },
  md: { span: 16 },
  lg: { span: 14 },
})`
  display: flex;
  justify-content: center;
  @media (max-width: 767px) {
    justify-content: flex-end;
  }
`;

export const LessonButtonSend = styled(Button).attrs({
  size: 'large',
})`
  width: 100%;
  @media (max-width: 767px) {
    width: 150px;
  }

  max-width: 614px;
  margin-bottom: 1rem;
`;

export const GlobalStylesLessonPage = createGlobalStyle`
  body{
    background-color: white; 
  }
`;

export const TextItalic = styled(Text)`
  font-style: italic;
`;
