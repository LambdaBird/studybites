import styled, { createGlobalStyle } from 'styled-components';
import { Row, Col, Button, Typography } from 'antd';

const { Paragraph } = Typography;

export const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const PageRow = styled(Row)`
  width: 100%;
`;

export const PageRowStart = styled(Row)`
  width: 100%;
  @media (max-width: 767px) {
    margin-top: auto;
  }
`;

export const BlockCol = styled(Col)`
  display: flex;
  justify-content: center;
  padding-top: 3rem;
`;

export const ProgressCol = styled(Col)`
  width: 100%;
  position: absolute;
  top: 43px;

  .ant-progress-inner {
    background: #fff;
  }
`;

export const LessonButton = styled(Button).attrs({
  size: 'large',
})`
  width: 100%;
  max-width: 614px;
  margin-bottom: 1rem;
`;

export const SendWrapper = styled(Col)`
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

export const Background = styled.div`
  background: white;
  min-height: calc(100% - 56px);
  width: 100%;
  position: absolute;
  z-index: -1;
`;

export const GlobalStylesLessonPage = createGlobalStyle`
  body{
    background-color: white; 
  }
`;

export const Delimiter = styled.div`
  line-height: 1.6em;
  width: 100%;
  text-align: center;

  &:before {
    display: inline-block;
    content: '***';
    font-size: 30px;
    line-height: 65px;
    height: 30px;
    letter-spacing: 0.2em;
  }
`;

export const CustomTableWrapper = styled.div`
  margin-top: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
`;

export const CustomTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  td {
    padding: 19px;
  }
`;

export const Quote = styled(Paragraph)`
  margin-top: 1rem;
  background-color: white;
  border-radius: 1rem;
  padding: 0.5rem 2rem 1rem 2rem;
`;

export const QuoteAuthor = styled.div`
  display: flex;
  justify-content: ${(props) => props.alignment};
`;
