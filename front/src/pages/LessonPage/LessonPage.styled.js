import styled, { createGlobalStyle } from 'styled-components';
import { Row, Col, Button } from 'antd';

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
