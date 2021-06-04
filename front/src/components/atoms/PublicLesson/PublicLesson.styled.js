import styled from 'styled-components';
import { Avatar, Col, Row, Typography } from 'antd';

const { Text } = Typography;

export const MainSpace = styled(Row)`
  background-color: white; // TODO COOR;
  padding: 1rem;
  height: 10rem;
`;

export const LeftContent = styled(Col)`
  margin-right: 1.5rem;
`;

export const RightContent = styled(Col)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const LessonImg = styled.img`
  height: 8rem;
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
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
`;

export const AuthorAvatar = styled(Avatar)`
  color: #fa541c; // TODO COLOR
  background-color: #ffd8bf; // TODO COLOR
`;

export const AuthorName = styled(Typography.Link)`
  margin-left: 0.5rem;
  white-space: nowrap;
`;
