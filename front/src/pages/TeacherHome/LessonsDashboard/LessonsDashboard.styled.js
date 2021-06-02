import styled from 'styled-components';
import { Row, Image, Col, Pagination, Typography } from 'antd';

const { Title } = Typography;

export const Wrapper = styled(Row)`
  margin-top: 48px;
`;

export const CardCol = styled(Col)`
  height: 8rem;
  width: 100%;
`;

export const DashboardControls = styled(Row)`
  width: 100%;
  padding: 0 16px;
`;

export const IconImage = styled(Image)`
  padding: 6px 8px 0 0;
`;

export const DashboardPagination = styled(Pagination)`
  align-self: flex-end;
`;

export const PaginationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
`;

export const DashboardTitle = styled(Title)`
  padding-top: 0.5em;
`;
