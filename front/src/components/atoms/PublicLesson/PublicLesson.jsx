import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Typography } from 'antd';

import lessonImage from '../../../resources/img/lesson.svg';
import {
  AuthorAvatar,
  AuthorContainer,
  AuthorName,
  DescriptionText,
  EnrollRow,
  LeftContent,
  LessonImg,
  MainSpace,
  RightContent,
} from './PublicLesson.styled';

const { Title } = Typography;

const PublicLesson = ({ lesson }) => {
  const { name, description, author } = lesson;
  return (
    <MainSpace size="large" wrap={false}>
      <LeftContent>
        <div>
          <LessonImg src={lessonImage} alt="Lesson" />
          <AuthorContainer>
            <AuthorAvatar>{author?.[0]}</AuthorAvatar>
            <AuthorName>{author}</AuthorName>
          </AuthorContainer>
        </div>
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
            Enroll
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
