import { Row, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const LessonsHeader = styled(Row)`
  margin-bottom: 1rem;
  width: 100%;
`;

export const LessonsMainDiv = styled(Row)`
  margin-bottom: 1rem;
  align-self: center;
  width: 100%;
`;

export const StyledTitle = styled(Title)`
  font-weight: 400 !important;
  font-size: 1.25rem !important;
`;

export const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 4rem;
`;
