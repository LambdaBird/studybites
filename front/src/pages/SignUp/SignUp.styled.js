import styled from 'styled-components';
import { Row } from 'antd';

export const MainRow = styled(Row)`
  padding-top: 4rem;
  align-content: flex-start;
  @media (max-width: 576px) {
    padding-top: 0;
  }
`;
