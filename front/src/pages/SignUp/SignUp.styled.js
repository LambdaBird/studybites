import styled from 'styled-components';
import { Row } from 'antd';

export const MainRow = styled(Row)`
  min-height: 100vh;
  padding-top: 8rem;
  align-content: flex-start;
  @media (max-width: 576px) {
    padding-top: 0;
  }
`;