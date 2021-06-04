import styled from 'styled-components';
import { Avatar, Col, Row, Typography } from 'antd';
import {
  DESCRIPTION_COLOR,
  VOLCANO_2,
  VOLCANO_6,
  WHITE_COLOR,
} from '../../../resources/styles/Global.styled';

const { Text } = Typography;

export const MainSpace = styled(Row)`
  display: flex;
  background-color: ${WHITE_COLOR};
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

export const EnrollRow = styled(Row)`
  margin-top: auto;
`;

export const DescriptionText = styled(Text)`
  text-align: justify;
  color: ${DESCRIPTION_COLOR};
`;

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${WHITE_COLOR}; /
  height: 2.5rem;
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
`;

export const LessonImg = styled.img`
  height: 8rem;
`;

export const AuthorAvatar = styled(Avatar)`
  color: ${VOLCANO_6};
  background-color: ${VOLCANO_2};
`;

export const AuthorName = styled(Typography.Link)`
  white-space: nowrap;
`;
