import {
  Avatar,
  Button,
  Image as ImageAntd,
  Progress,
  Row,
  Typography,
} from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

const { Paragraph } = Typography;

export const Main = styled(Row)`
  background-color: ${variables['lesson-block-background']};
  padding: 1rem;
  flex-direction: column;
`;

export const ImageWrapper = styled.div`
  height: 12rem;
`;

export const Image = styled(ImageAntd).attrs({
  width: '100%',
  height: '10rem',
  preview: false,
})`
  object-fit: cover;
`;

export const Title = styled(Typography.Title)`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 20px !important;
  line-height: 28px !important;
  overflow-wrap: anywhere;
`;

export const Description = styled(Paragraph).attrs({
  ellipsis: {
    tooltip: true,
    rows: 2,
  },
})`
  text-align: justify;
  color: ${variables['lesson-block-description-color']};
`;

export const DescriptionRow = styled(Row)`
  margin-bottom: 1rem;
`;

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${variables['lesson-block-background']};
  height: 2.5rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
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
  width: 100%;
`;

export const Enroll = styled(Button)`
  width: 100%;
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
