import React, { useEffect } from 'react';
import { Col, Row, Skeleton } from 'antd';
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
import useTableRequest from '../../../../hooks/useTableRequest';
import { getLessons } from '../../../../utils/api/v1/lesson/lesson';

const LessonsMain = ({ searchLessons }) => {
  const { t } = useTranslation();

  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const onChangeLessonPage = (page) => {
    history.push({
      search: `?page=${page}`,
    });
  };

  const PAGE_SIZE = 4;

  const { loading, dataSource, pagination, handleTableChange } =
    useTableRequest({
      requestFunc: getLessons,
      onChangePage: onChangeLessonPage,
      defaultPagination: {
        showSizeChanger: false,
        current: 1,
        pageSize: PAGE_SIZE,
      },
    });

  const onChangeLessonsPagination = (page) => {
    handleTableChange({
      current: page,
    });
  };

  useEffect(() => {
    const page = parseInt(query.get('page'), 10) || 1;
    handleTableChange({
      current: page < 0 ? 1 : page,
      pageSize: PAGE_SIZE,
    });
  }, []);

  useEffect(() => {
    if (searchLessons !== null) {
      handleTableChange({
        pageSize: PAGE_SIZE,
        search: searchLessons,
      });
    }
  }, [searchLessons]);

  if (loading || dataSource?.length > 0) {
    return (
      <LessonsMainDiv>
        {loading ? (
          <Row gutter={[16, 16]}>
            <Col lg={{ span: 12 }} md={{ span: 24 }}>
              <Skeleton avatar paragraph={{}} />
            </Col>
            <Col lg={{ span: 12 }} md={{ span: 24 }}>
              <Skeleton avatar paragraph={{}} />
            </Col>
            <Col lg={{ span: 12 }} md={{ span: 24 }}>
              <Skeleton avatar paragraph={{}} />
            </Col>
            <Col lg={{ span: 12 }} md={{ span: 24 }}>
              <Skeleton avatar paragraph={{}} />
            </Col>
          </Row>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {dataSource.map((lesson) => (
                <Col key={lesson.id} lg={{ span: 12 }} md={{ span: 24 }}>
                  <PublicLesson lesson={lesson} />
                </Col>
              ))}
            </Row>
            <Row justify="end">
              {pagination && (
                <LessonsPagination
                  current={pagination?.current}
                  total={pagination?.total}
                  pageSize={pagination?.pageSize}
                  showSizeChanger={pagination?.showSizeChanger}
                  onChange={onChangeLessonsPagination}
                />
              )}
            </Row>
          </>
        )}
      </LessonsMainDiv>
    );
  }

  return (
    <LessonsMainDiv>
      <LessonsEmpty
        image={emptyImg}
        description={t('user_home.open_lessons.not_found')}
      />
    </LessonsMainDiv>
  );
};

LessonsMain.defaultProps = {
  searchLessons: null,
};

LessonsMain.propTypes = {
  searchLessons: PropTypes.string,
};

export default LessonsMain;
