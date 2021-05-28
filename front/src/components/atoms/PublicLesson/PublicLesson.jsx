import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Typography } from 'antd';

import { useTranslation } from 'react-i18next';
import lessonImage from '../../../resources/img/lesson.jpg';
import {
  AuthorAvatar,
  AuthorContainer,
  AuthorName,
  DescriptionText,
  EnrollRow,
  LeftContent,
  MainSpace,
  RightContent,
} from './PublicLesson.styled';

const { Title } = Typography;

const PublicLesson = ({ lesson }) => {
  const { t } = useTranslation();
  const { name, description, maintainer } = lesson;
  return (
    <MainSpace size="large" wrap={false}>
      <LeftContent>
        <img src={lessonImage} alt="Lesson" />
        <AuthorContainer>
          <AuthorAvatar>{maintainer?.[0]}</AuthorAvatar>
          <AuthorName>{maintainer}</AuthorName>
        </AuthorContainer>
      </LeftContent>
      <RightContent>
        <Row>
          <Title level={3}>{name}</Title>
        </Row>
        <Row>
          <DescriptionText>{description}</DescriptionText>
        </Row>
        <EnrollRow justify="end">
          <Button size="medium" type="secondary">
            {t('user_home.open_lessons.enroll_button')}
          </Button>
        </EnrollRow>
      </RightContent>
    </MainSpace>
  );
};

PublicLesson.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    maintainer: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PublicLesson;
