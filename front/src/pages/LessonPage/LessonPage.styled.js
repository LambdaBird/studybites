import styled from 'styled-components';
import { Row, Col, Button } from 'antd';

export const Page = styled.div`
  width: 100%;
  height: 92vh;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  @media (max-width: 576px) {
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
  top: 41px;
`;

export const LessonButton = styled(Button)`
  width: 100%;
  max-width: 614px;
`;