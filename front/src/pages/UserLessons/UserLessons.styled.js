import styled from 'styled-components';
import { Row, Typography } from 'antd';

const { Title } = Typography;

export const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 3rem;

  @media (max-width: 767px) {
    padding: 2rem;
  }
`;

export const LessonsHeader = styled(Row)`
  margin-bottom: 1rem;
  width: 100%;
`;

export const OpenLessonsTitle = styled(Title)`
  margin-bottom: 0 !important;
  font-weight: 400 !important;
  font-size: 1.25rem !important;
`;

export const LessonsRow = styled(Row)`
  width: 100%;
`;
