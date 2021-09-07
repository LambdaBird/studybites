import { Avatar, Col, Image, Progress, Row, Typography } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

const { Paragraph, Title } = Typography;

export const MainSpace = styled(Row)`
  height: 12rem;
  background-color: ${variables['lesson-block-background']};
`;

export const LeftContent = styled(Col)`
  padding: 1rem 1rem 0;
`;

export const RightContent = styled(Col)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`;

export const LessonImg = styled(Image).attrs({
  height: '8rem',
  width: '15rem',
  preview: false,
})`
  object-fit: cover;
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

  position: absolute;
  left: 1.5rem;
  bottom: 3.5rem;
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
`;

export const AuthorAvatar = styled(Avatar)`
  color: ${variables['avatar-second-color']};
  background-color: ${variables['avatar-first-color']};
`;

export const AuthorName = styled(Typography.Link)`
  margin-left: 0.5rem;
  white-space: nowrap;
`;

export const EnrollRow = styled(Row)`
  margin-top: auto;
`;

export const ProgressBar = styled(Progress)`
  padding: 0.5rem 0;

  .ant-progress-bg {
    background-color: ${variables['primary-color']} !important;
  }

  .ant-progress-text {
    color: ${variables['secondary-text-color']} !important;
  }
`;

export const TitleEllipsis = styled(Title)`
  overflow-wrap: anywhere;
`;
