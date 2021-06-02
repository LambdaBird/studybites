import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Progress, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import lessonImage from '../../../resources/img/lesson.jpg';
import {
  AuthorContainer,
  MoreIconImg,
  ProgressBarCol,
} from './OngoingLesson.styled';
import {
  AuthorAvatar,
  AuthorName,
  DescriptionText,
  EnrollRow,
  LeftContent,
  MainSpace,
  RightContent,
} from '../PublicLesson/PublicLesson.styled';

import moreIcon from '../../../resources/icons/moreIcon.svg';

const { Title } = Typography;

const OngoingLesson = ({ lesson }) => {
  const { t } = useTranslation();
  const { name, description, author } = lesson;
  return (
    <MainSpace size="large" wrap={false}>
      <LeftContent>
        <Col span={24}>
          <img height="100%" src={lessonImage} alt="Lesson" />
          <AuthorContainer>
            <AuthorAvatar>{author?.[0]}</AuthorAvatar>
            <AuthorName>{author}</AuthorName>
          </AuthorContainer>
        </Col>
        <ProgressBarCol span={24}>
          <Progress percent={50} />
        </ProgressBarCol>
      </LeftContent>
      <RightContent>
        <Row justify="space-between" align="flex-start">
          <Title level={3}>{name}</Title>
          <MoreIconImg src={moreIcon} alt="more" />
        </Row>
        <Row>
          <DescriptionText>{description}</DescriptionText>
        </Row>
        <EnrollRow justify="end">
          <Button size="medium" type="primary">
            {t('user_lessons.ongoing_lessons.continue_button')}
          </Button>
        </EnrollRow>
      </RightContent>
    </MainSpace>
  );
};

OngoingLesson.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default OngoingLesson;
