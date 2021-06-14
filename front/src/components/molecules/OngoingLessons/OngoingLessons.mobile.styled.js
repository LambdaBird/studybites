import styled from 'styled-components';
import { Row, Typography } from 'antd';

const { Title } = Typography;

export const Header = styled(Row)`
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  width: 100%;
`;

export const HeaderTitle = styled(Title)`
  size: 24px !important;
  line-height: 32px !important;
  font-weight: 400 !important;
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
`;
