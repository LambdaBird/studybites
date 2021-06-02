import React from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LessonsHeader, LessonsMainDiv } from './OngoingLessons.styled';
import LessonsMain from './LessonsMain';

const { Title } = Typography;

const OngoingLessons = () => {
  const { t } = useTranslation();

  return (
    <>
      <LessonsHeader justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <Title level={3}>{t('user_home.ongoing_lessons.title')}</Title>
          </Row>
        </Col>
        <Col>
          <Link to="/user-lessons">
            {t('user_home.ongoing_lessons.view_all_lessons')}
          </Link>
        </Col>
      </LessonsHeader>
      <LessonsMainDiv>
        <LessonsMain />
      </LessonsMainDiv>
    </>
  );
};

export default OngoingLessons;
