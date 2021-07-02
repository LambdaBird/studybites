import styled from 'styled-components';
import { Col, Row } from 'antd';

export const BlockCol = styled(Col)`
  display: flex;
  justify-content: center;
  padding-top: ${(props) => (props.top ? props.top : '3rem')};
`;

export const PageRow = styled(Row)`
  width: 100%;
`;

export const BlockWrapper = styled(Row)`
  width: 100%;
  max-width: 614px;
  padding: ${(props) => props.padding || '2rem'};
  background-color: rgba(245, 245, 245, 1);
  border-radius: 8px;
`;

export const StyledRow = styled(Row)`
  width: 100%;
`;
