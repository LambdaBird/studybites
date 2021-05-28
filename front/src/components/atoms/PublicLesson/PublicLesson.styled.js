import styled from 'styled-components';
import { Avatar, Space, Typography } from 'antd';
import {
  DESCRIPTION_COLOR,
  VOLCANO_2,
  VOLCANO_6,
  WHITE_COLOR,
} from '../../../resources/styles/Global.styled';

const { Text } = Typography;

export const MainSpace = styled(Space)`
  background-color: ${WHITE_COLOR};
  padding: 1rem;
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
  width: 8rem;
  position: absolute;
  left: 2rem;
  bottom: 15%;
  border-radius: 5px;
  padding: 0.5rem 0;
`;

export const AuthorAvatar = styled(Avatar)`
  color: ${VOLCANO_6};
  background-color: ${VOLCANO_2};
`;

export const AuthorName = styled(Typography.Link)`
  margin-left: 1rem;
  white-space: nowrap;
`;
