import styled from 'styled-components';
import { Row, Typography, Col } from 'antd';
import Search from '@sb-ui/components/molecules/Search';

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  padding: 3rem;
  @media (max-width: 767px) {
    padding: 1rem;
  }
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`;

export const OpenHeader = styled(Row)`
  margin-bottom: 2rem;
  width: 100%;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 767px) {
    justify-content: space-between;
  }
`;

export const OpenTitle = styled(Typography.Title)`
  margin-bottom: 0 !important;
  font-size: 1.25rem !important;
  line-height: 1.25rem !important;
  font-weight: 400 !important;
`;

export const Column = styled(Col)`
  width: 100%;
`;

export const StyledSearch = styled(Search)``;
