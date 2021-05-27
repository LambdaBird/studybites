import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import emptyImg from '../../../../resources/img/empty.svg';
import {
  LessonsEmpty,
  LessonsMainDiv,
  LessonsPagination,
} from './LessonsMain.styled';
import PublicLesson from '../../../atoms/PublicLesson';

const LessonsMain = ({ lessons }) => {
  const { t } = useTranslation();

  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const [currentPage, setCurrentPage] = useState(1);

  const DISPLAY_LESSON_COUNT = 4;
  const [showLessons, setShowLessons] = useState(
    lessons.slice(0, DISPLAY_LESSON_COUNT),
  );

  useEffect(() => {
    setShowLessons(lessons.slice(0, DISPLAY_LESSON_COUNT));
  }, [lessons]);

  const changeShowLessons = (page) => {
    const fromElement = (page - 1) * DISPLAY_LESSON_COUNT;
    const lessonsToShow = lessons.slice(
      fromElement,
      fromElement + DISPLAY_LESSON_COUNT,
    );
    setShowLessons(lessonsToShow);
    setCurrentPage(page);
  };

  useEffect(() => {
    const page = parseInt(query.get('page'), 10) || 1;
    changeShowLessons(page);
  }, []);

  const onChangeLessonPage = (page) => {
    history.push({
      search: `?page=${page}`,
    });
    changeShowLessons(page);
  };

  if (showLessons?.length > 0) {
    return (
      <LessonsMainDiv>
        <Row gutter={[16, 16]}>
          {showLessons.map((lesson) => (
            <Col key={lesson.id} lg={{ span: 12 }} md={{ span: 24 }}>
              <PublicLesson lesson={lesson} />
            </Col>
          ))}
        </Row>
        <Row justify="end">
          <LessonsPagination
            current={currentPage}
            total={lessons.length}
            pageSize={DISPLAY_LESSON_COUNT}
            showSizeChanger={false}
            onChange={onChangeLessonPage}
          />
        </Row>
      </LessonsMainDiv>
    );
  }

  return (
    <LessonsMainDiv>
      <LessonsEmpty
        image={emptyImg}
        description={t('user_home.lessons.not_found')}
      />
    </LessonsMainDiv>
  );
};

LessonsMain.propTypes = {
  lessons: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default LessonsMain;
