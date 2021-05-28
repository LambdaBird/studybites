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
  MainSpace,
} from './PublicLesson.styled';

const { Title } = Typography;

const PublicLesson = ({ lesson }) => {
  const { t } = useTranslation();
  const { name, description, maintainer } = lesson;
  return (
    <MainSpace size="large" wrap={false}>
      <div>
        <img src={lessonImage} alt="Lesson" />
        <AuthorContainer>
          <AuthorAvatar>{maintainer?.[0]}</AuthorAvatar>
          <AuthorName>{maintainer}</AuthorName>
        </AuthorContainer>
      </div>
      <div>
        <Row>
          <Title level={3}>{name}</Title>
        </Row>
        <Row>
          <DescriptionText>{description}</DescriptionText>
        </Row>
        <Row justify="end">
          <Button size="medium" type="secondary">
            {t('user_home.open_lessons.enroll_button')}
          </Button>
        </Row>
      </div>
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
