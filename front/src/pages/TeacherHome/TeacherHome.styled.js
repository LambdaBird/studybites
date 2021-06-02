import styled from 'styled-components';
import { Row } from 'antd';

export const Page = styled.div`
  display: flex;
  justify-content: center;
`;

export const Wrapper = styled(Row)`
  width: 100%;
  min-height: 100vh;
  max-width: 1424px;
  padding: 32px 16px 16px 16px;
  background: rgba(245, 245, 245, 1);
`;
