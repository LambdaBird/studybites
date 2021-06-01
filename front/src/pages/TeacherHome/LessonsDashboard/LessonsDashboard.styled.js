import styled from 'styled-components';
import { Row, Image, Col, Pagination, Typography } from 'antd';

const { Title } = Typography;

export const Wrapper = styled(Row)`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  alignitems: center;
`;

export const CardCol = styled(Col)`
  height: 22%;
  width: 100%;
`;

export const DashboardControls = styled(Row)`
  width: 100%;
`;

export const DashboardLessons = styled(Row)`
  height: 65vh;
`;

export const IconImage = styled(Image)`
  padding: 6px 8px 0 0;
`;

export const DashboardPagination = styled(Pagination)`
  align-self: flex-end;
`;

export const DashboardTitle = styled(Title)`
  padding-top: 0.5em;
`;
