import React from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import CurrentLesson from '../../atoms/CurrentLesson';
import { LessonsHeader, LessonsMain } from './OngoingLessons.styled';

const { Title } = Typography;

const lessonExample = {
  title: 'How to use StudyBites. ',
  maintainer: 'John Doe',
};

const lessonMultipleExample = {
  title: 'How to use StudyBites. Multiline title 🌚',
  maintainer: 'John Doe',
};

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
          <Typography.Link>
            {t('user_home.ongoing_lessons.view_all_lessons')}
          </Typography.Link>
        </Col>
      </LessonsHeader>
      <LessonsMain gutter={[16, 16]}>
        <Col xl={{ span: 8 }} lg={{ span: 24 }}>
          <CurrentLesson lesson={lessonExample} />
        </Col>
        <Col xl={{ span: 8 }} lg={{ span: 24 }}>
          <CurrentLesson lesson={lessonMultipleExample} />
        </Col>
        <Col xl={{ span: 8 }} lg={{ span: 24 }}>
          <CurrentLesson lesson={lessonExample} />
        </Col>
      </LessonsMain>
    </>
  );
};

export default OngoingLessons;
