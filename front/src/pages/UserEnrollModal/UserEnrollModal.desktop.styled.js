import styled from 'styled-components';
import { Avatar, Button, Col, Row, Space, Typography } from 'antd';
import {
  DESCRIPTION_COLOR,
  VOLCANO_2,
  VOLCANO_6,
  WHITE_COLOR,
} from '@sb-ui/resources/styles/Global.styled';

const { Text } = Typography;

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${WHITE_COLOR}; /
  height: 2.5rem;
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  border-radius: 5px;
  padding: 0.5rem 1rem;
`;

export const LeftColumn = styled(Row)`
  width: 50%;
  margin-right: 1rem;
`;

export const RightColumn = styled(Row)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
`;

export const NameColumn = styled(Col)`
  margin-top: 1rem;
`;

export const ReviewHeader = styled.div`
  flex: 0 0;
`;

export const ReviewHeaderSpace = styled(Space)`
  align-items: baseline;
`;

export const ReviewBody = styled.div`
  flex: 1 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const ReviewBodyText = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

export const ReviewFooter = styled.div`
  flex: 0 0;
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
`;

export const StartButton = styled(Button)`
  width: 8rem;
`;

export const AuthorAvatar = styled(Avatar)`
  color: ${VOLCANO_6};
  background-color: ${VOLCANO_2};
`;

export const AuthorName = styled(Typography.Link)`
  margin-left: 0.5rem;
  white-space: nowrap;
`;

export const DescriptionText = styled(Text)`
  text-align: justify;
  color: ${DESCRIPTION_COLOR};
`;
