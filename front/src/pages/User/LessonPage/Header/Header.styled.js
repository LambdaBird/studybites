import styled from 'styled-components';
import { Col, Row } from 'antd';

export const ProgressCol = styled(Col)`
  width: 100%;
  position: absolute;
  top: 43px;

  .ant-progress-inner {
    background: #fff;
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
