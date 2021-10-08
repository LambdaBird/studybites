import { Row, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const Header = styled(Row).attrs({
  justify: 'space-between',
  align: 'middle',
})`
  padding: 1rem 0;
  margin-bottom: 1rem;
  width: 100%;
`;

export const HeaderTitle = styled(Title).attrs({
  level: 4,
})`
  font-weight: 400 !important;
  font-size: 1.25rem !important;
  margin-bottom: 0 !important;
`;

export const Main = styled(Row)`
  margin-bottom: 1rem;
  align-self: center;
  height: 100%;
  width: 100%;
`;

export const Footer = styled(Row)`
  width: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;
