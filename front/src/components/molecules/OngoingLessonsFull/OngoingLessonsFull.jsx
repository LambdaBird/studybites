import React, { useState } from 'react';
import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import DebouncedSearch from '../../atoms/DebounedSearch';
import { LessonsHeader, OpenLessonsTitle } from './OngoingLessonsFull.styled';
import LessonsMain from '../OpenLessons/LessonsMain';

const OngoingLessonsFull = () => {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState(null);

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  return (
    <>
      <LessonsHeader justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <Space size="large">
              <OpenLessonsTitle level={3}>
                {t('user_lessons.ongoing_lessons.title')}
              </OpenLessonsTitle>
              <DebouncedSearch
                delay={500}
                placeholder={t('user_home.open_lessons.search')}
                allowClear
                onSearch={onSearchChange}
                onChange={onSearchChange}
              />
            </Space>
          </Row>
        </Col>
      </LessonsHeader>
      <LessonsMain isOngoingLesson searchLessons={searchText} />
    </>
  );
};

export default OngoingLessonsFull;
