import styled from 'styled-components';
import { Col, Row, Empty, Pagination } from 'antd';

export const Column = styled(Col)`
  width: 100%;
`;

export const Main = styled(Row)`
  align-self: center;
  height: 100%;
  width: 100%;
  padding-bottom: 1rem;
`;

export const Container = styled(Empty)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 5rem;
  padding-bottom: 10rem;
`;

export const Pages = styled(Pagination)`
  margin-top: 1rem;
`;
