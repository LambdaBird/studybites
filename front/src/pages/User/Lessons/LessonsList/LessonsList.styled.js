import { Col, Empty, Pagination, Row, Typography } from 'antd';
import styled from 'styled-components';

import Search from '@sb-ui/components/molecules/Search';

const { Title } = Typography;

export const Wrapper = styled.div`
  margin-bottom: 4rem;
  width: 100%;
`;

export const LessonsHeader = styled(Row)`
  margin-bottom: 2rem;
  align-items: center;
  @media (max-width: 767px) {
    justify-content: space-between;
  }
`;

export const OpenLessonsTitle = styled(Title).attrs({
  level: 4,
})`
  margin-bottom: 0 !important;
  font-weight: 400 !important;
  font-size: 1.25rem !important;
`;

export const FilterWrapper = styled.div`
  display: flex;
`;

export const LessonsRow = styled(Row).attrs({
  gutter: [32, 32],
})`
  @media (max-width: 767px) {
    margin: 0 !important;
  }
`;

export const StyledPagination = styled(Pagination).attrs({
  showSizeChanger: false,
})`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const StyledSearch = styled(Search).attrs({
  placement: 'bottomLeft',
  marginRight: '1rem',
})``;

export const AuthorWrapper = styled.div`
  margin-left: 1rem;
`;

export const LessonCol = styled(Col).attrs(() => ({
  lg: { span: 12 },
  md: { span: 24 },
}))`
  width: 100%;

  @media (max-width: 767px) {
    padding: 0 !important;
  }
`;

export const EmptyContainer = styled(Empty)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
