import styled from 'styled-components';
import { Avatar, Space, Typography } from 'antd';

const { Text } = Typography;

export const MainSpace = styled(Space)`
  background-color: white; // TODO COOR;
  padding: 1rem;
`;

export const DescriptionText = styled(Text)`
  text-align: justify;
  color: rgba(0, 0, 0, 0.45); // TODO COLOR
`;

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: white; // TODO COLOR
  height: 2.5rem;
  width: 8rem;
  position: absolute;
  left: 2rem;
  bottom: 15%;
  border-radius: 5px;
  padding: 1rem 0;
`;

export const AuthorAvatar = styled(Avatar)`
  color: #fa541c; // TODO COLOR
  background-color: #ffd8bf; // TODO COLOR
`;

export const AuthorName = styled(Typography.Link)`
  white-space: nowrap;
`;
