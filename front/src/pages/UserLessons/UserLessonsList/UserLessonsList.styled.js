import { Col, Pagination, Row, Typography } from 'antd';
import styled from 'styled-components';
import Search from '@sb-ui/components/molecules/Search';

const { Title } = Typography;

export const Wrapper = styled.div`
  margin-bottom: 4rem;
  width: 100%;
`;

export const LessonsHeader = styled(Row)`
  margin-bottom: 2rem;
`;

export const OpenLessonsTitle = styled(Title)`
  margin-bottom: 0 !important;
  font-weight: 400 !important;
  font-size: 1.25rem !important;
`;

export const LessonsRow = styled(Row)`
  width: 100%;

  @media (max-width: 767px) {
    margin: 0 !important;
  }
`;

export const StyledPagination = styled(Pagination)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const StyledSearch = styled(Search)``;

export const LessonCol = styled(Col)`
  width: 100%;

  @media (max-width: 767px) {
    padding: 0 !important;
  }
`;
