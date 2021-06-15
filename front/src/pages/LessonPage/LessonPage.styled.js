import styled from 'styled-components';
import { Row, Col, Button } from 'antd';

export const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  @media (max-width: 767px) {
    justify-content: space-between;
  }
`;

export const PageRow = styled(Row)`
  width: 100%;
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

export const Background = styled.div`
  background: white;
  min-height: calc(100% - 56px);
  width: 100%;
  position: absolute;
  z-index: -1;
`;
