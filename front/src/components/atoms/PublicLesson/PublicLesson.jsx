import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Typography } from 'antd';

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
  const { title, description, author } = lesson;
  return (
    <MainSpace size="large" wrap={false}>
      <div>
        <img src={lessonImage} alt="Lesson" />
        <AuthorContainer>
          <AuthorAvatar>{author?.[0]}</AuthorAvatar>
          <AuthorName>{author}</AuthorName>
        </AuthorContainer>
      </div>
      <div>
        <Row>
          <Title level={3}>{title}</Title>
        </Row>
        <Row>
          <DescriptionText>{description}</DescriptionText>
        </Row>
        <Row justify="end">
          <Button size="medium" type="secondary">
            Enroll
          </Button>
        </Row>
      </div>
    </MainSpace>
  );
};

PublicLesson.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PublicLesson;
