import { Avatar, Col, Row, Typography } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

const { Paragraph, Title } = Typography;

export const MainSpace = styled(Row)`
  background-color: ${variables['lesson-block-background']};
  padding: 1rem;
  height: 12rem;
`;

export const LeftContent = styled(Col)`
  margin-right: 1.5rem;
`;

export const RightContent = styled(Col)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

export const LessonImg = styled.img`
  height: 10rem;
`;

export const DescriptionText = styled(Paragraph)`
  text-align: justify;
  color: ${variables['lesson-block-description-color']};
  overflow-wrap: anywhere;
`;

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${variables['lesson-block-background']};
  height: 2.5rem;
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
`;

export const AuthorAvatar = styled(Avatar)`
  color: ${variables['avatar-second-color']};
  background-color: ${variables['avatar-first-color']};
`;

export const AuthorName = styled(Typography.Link)`
  margin-left: 0.5rem;
  white-space: nowrap;
`;

export const EnrollRow = styled.div.attrs({
  justify: 'space-between',
  align: 'middle',
})`
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  margin-top: auto;
`;

export const EnrollColKeyword = styled(Col)`
  flex: 1 1 auto;
  width: 0;
`;

export const EnrollColButton = styled(Col)`
  flex: 0 1 auto;
`;

export const RowEllipsis = styled(Row)`
  overflow: hidden;
`;

export const TitleEllipsis = styled(Title).attrs({
  ellipsis: {
    tooltip: true,
  },
  level: 3,
})`
  overflow-wrap: anywhere;
`;
