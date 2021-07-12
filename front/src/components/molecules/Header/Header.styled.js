import { Avatar, Row, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

export const Container = styled.header`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: white;
  height: 56px;
`;

export const RowMain = styled(Row)`
  padding: 0 2rem;
  height: 56px;
`;

export const Logo = styled.img`
  height: 1.75rem;
  cursor: pointer;
`;

export const StyledAvatar = styled(Avatar)`
  color: #f56a00;
  background-color: #fde3cf;
`;

export const Profile = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledName = styled(Text)`
  font-size: 0.85rem;
`;
