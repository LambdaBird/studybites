import { Pagination, Row, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const Wrapper = styled.div`
  margin-bottom: 4rem;
  width: 100%;
`;

export const LessonsHeader = styled(Row)`
  margin-bottom: 1rem;
`;

export const OpenLessonsTitle = styled(Title)`
  margin-bottom: 0 !important;
  font-weight: 400 !important;
  font-size: 1.25rem !important;
`;

export const LessonsRow = styled(Row)`
  width: 100%;
`;

export const StyledPagination = styled(Pagination)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
