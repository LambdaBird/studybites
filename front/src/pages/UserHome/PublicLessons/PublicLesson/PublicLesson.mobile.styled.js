import styled from 'styled-components';
import { Avatar, Row, Typography, Button } from 'antd';

import {
  DESCRIPTION_COLOR,
  VOLCANO_2,
  VOLCANO_6,
  WHITE_COLOR,
} from '@sb-ui/resources/styles/Global.styled';

const { Text } = Typography;

export const Main = styled(Row)`
  background-color: ${WHITE_COLOR};
  padding: 1rem;
  flex-direction: column;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Title = styled(Typography.Title)`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 20px !important;
  line-height: 28px !important;
`;

export const Description = styled(Text)`
  text-align: justify;
  color: ${DESCRIPTION_COLOR};
`;

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${WHITE_COLOR};
  height: 2.5rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
`;

export const AuthorAvatar = styled(Avatar)`
  color: ${VOLCANO_6};
  background-color: ${VOLCANO_2};
`;

export const AuthorName = styled(Typography.Link)`
  margin-left: 0.5rem;
  white-space: nowrap;
`;

export const EnrollRow = styled(Row)`
  margin-top: auto;
  width: 100%;
`;

export const Enroll = styled(Button)`
  width: 100%;
`;
