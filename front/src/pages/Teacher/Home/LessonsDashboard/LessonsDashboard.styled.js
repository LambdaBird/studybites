import { Col, Pagination, Row, Select, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const Wrapper = styled(Row)`
  margin-top: 3rem;
`;

export const CardCol = styled(Col).attrs({
  span: 12,
})`
  height: 8rem;
  width: 100%;
`;

export const DashboardControls = styled(Row).attrs({
  justify: 'space-between',
  align: 'middle',
})`
  width: 100%;
  padding: 0 1rem;
`;

export const DashboardPagination = styled(Pagination).attrs({
  showSizeChanger: false,
  size: 'small',
})`
  align-self: flex-end;
`;

export const PaginationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;
`;

export const DashboardTitle = styled(Title).attrs({
  level: 4,
})`
  padding-top: 0.5rem;
  font-weight: 400 !important;
  font-size: 1.25rem !important;
`;

export const StyledSelect = styled(Select)`
  min-width: 8rem;
`;
