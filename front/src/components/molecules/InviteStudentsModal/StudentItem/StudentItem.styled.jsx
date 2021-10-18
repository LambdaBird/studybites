import {
  Avatar as AvatarAntd,
  Button as ButtonAntd,
  List,
  Typography,
} from 'antd';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const ListItem = styled(List.Item)`
  display: flex;
`;

export const Avatar = styled(AvatarAntd).attrs({
  icon: <UserOutlined />,
})`
  margin-left: 1.5rem;
`;

export const Name = styled(Text)`
  margin-left: 0.625rem;
`;

export const ResendWrapper = styled.div`
  margin-left: auto;
`;

export const ResendButton = styled(ButtonAntd).attrs({
  type: 'link',
})`
  margin-right: 0.625rem;
`;

export const DeleteButton = styled(ButtonAntd).attrs({
  type: 'secondary',
  shape: 'circle',
})`
  margin-right: 1.5rem;
`;
