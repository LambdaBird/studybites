import styled from 'styled-components';
import { Row, Typography } from 'antd';

const { Title } = Typography;

export const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 3rem;
  max-width: 1600px;
  margin: 0 auto;
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
