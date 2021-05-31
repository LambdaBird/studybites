import styled from 'styled-components';
import { Empty, Pagination } from 'antd';

export const LessonsMainDiv = styled.div`
  align-self: center;
  height: 100%;
  width: 100%;
`;

export const LessonsEmpty = styled(Empty)`
  margin-top: 6rem;
`;

export const LessonsPagination = styled(Pagination)`
  margin-top: 1rem;
`;