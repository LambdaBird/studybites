import {
  Avatar,
  Button,
  Col,
  Image as ImageAntd,
  Row,
  Space,
  Typography,
} from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

const { Text } = Typography;

export const Image = styled(ImageAntd).attrs({
  height: '20rem',
  width: '100%',
  preview: false,
})`
  object-fit: cover;
`;

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${variables['lesson-block-background']};
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

export const NameColumn = styled(Col).attrs({
  span: 24,
})`
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
  color: ${variables['avatar-second-color']};
  background-color: ${variables['avatar-first-color']};
`;

export const AuthorName = styled(Typography.Link)`
  margin-left: 0.5rem;
  white-space: nowrap;
`;

export const DescriptionText = styled(Text)`
  text-align: justify;
  color: ${variables['lesson-block-description-color']};
`;

export const KeywordsCol = styled(Col).attrs({
  span: 24,
})`
  margin-top: 1rem;
`;
