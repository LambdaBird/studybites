import React, { useState } from 'react';
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
import LessonModal from './LessonModal';

const { Title } = Typography;

const PublicLesson = ({ lesson }) => {
  const { t } = useTranslation();
  const { name, description, author } = lesson;
  const [visible, setVisible] = useState(false);

  return (
    <MainSpace size="large" wrap={false}>
      <LessonModal visible={visible} setVisible={setVisible} lesson={lesson} />
      <LeftContent>
        <img src={lessonImage} alt="Lesson" />
        <AuthorContainer>
          <AuthorAvatar>{author?.[0]}</AuthorAvatar>
          <AuthorName>{author}</AuthorName>
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
          <Button
            size="medium"
            type="secondary"
            onClick={() => setVisible(true)}
          >
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
    author: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PublicLesson;
