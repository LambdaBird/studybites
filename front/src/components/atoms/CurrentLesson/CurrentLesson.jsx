import React from 'react';
import { Button, Col, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  LeftColumn,
  MainSpace,
  ProgressBar,
  RightColumn,
} from './CurrentLesson.styled';

import lessonImg from '../../../resources/img/lesson.svg';
import { AuthorAvatar, AuthorName } from '../PublicLesson/PublicLesson.styled';

const { Title } = Typography;

const CurrentLesson = ({ lesson }) => {
  const { t } = useTranslation();
  const { name, maintainer } = lesson;
  const { firstName, lastName } = maintainer?.userInfo;
  const author = `${firstName} ${lastName}`;
  return (
    <MainSpace>
      <LeftColumn span={8}>
        <img height={100} src={lessonImg} alt="Lesson" />
        <ProgressBar percent={50} />
      </LeftColumn>
      <RightColumn span={14}>
        <Title level={4}>{name}</Title>
        <Row justify="space-between" align="between">
          <Col>
            <AuthorAvatar>{author?.[0]}</AuthorAvatar>
            <AuthorName>{author}</AuthorName>
          </Col>
          <Col>
            <Button type="primary">
              {t('user_home.ongoing_lessons.continue_button')}
            </Button>
          </Col>
        </Row>
      </RightColumn>
    </MainSpace>
  );
};

CurrentLesson.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    maintainer: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default CurrentLesson;
