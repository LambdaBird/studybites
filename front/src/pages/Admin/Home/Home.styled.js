import { Row, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const TitleHeader = styled(Title).attrs({
  level: 3,
})`
  margin-bottom: 0 !important;
`;

export const MainDiv = styled.div`
  padding: 50px;
`;

export const TableHeader = styled(Row).attrs({
  justify: 'space-between',
  align: 'middle',
})`
  margin-bottom: 1rem;
`;
