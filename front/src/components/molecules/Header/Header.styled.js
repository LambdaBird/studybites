import styled from 'styled-components';
import { Button, Row, Typography } from 'antd';

const { Text } = Typography;

export const RowMain = styled(Row)`
  padding: 1rem;
  img {
    height: 32px;
  }
`;

export const ProfileText = styled(Text)`
  margin-right: 0.5rem;
`;

export const SignOutButton = styled(Button)`
  margin-right: 0.5rem;
`;
