import { Row, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const Page = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 3rem;
`;

export const TitleHeader = styled(Title).attrs({
  level: 3,
})`
  margin-bottom: 0 !important;
`;

export const TableHeader = styled(Row).attrs({
  justify: 'space-between',
  align: 'middle',
})`
  margin-bottom: 1rem;
`;
