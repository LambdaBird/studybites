import styled from 'styled-components';
import { Button, Row, Typography } from 'antd';

const { Text } = Typography;

export const RowMain = styled(Row)`
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  height: 3.5rem;
`;

export const LogoText = styled(Text)`
  margin-left: 0.5rem;
`;

export const ProfileText = styled(Text)`
  margin-right: 0.5rem;
`;

export const SignOutButton = styled(Button)`
  margin-right: 0.5rem;
`;
