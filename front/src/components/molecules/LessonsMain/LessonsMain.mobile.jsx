import { useEffect } from 'react';
import { Col, Row, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import emptyImg from '@sb-ui/resources/img/empty.svg';
import PublicLesson from '@sb-ui/components/atoms/PublicLesson';
import { getLessons } from '@sb-ui/utils/api/v1/lesson/lesson';
import { useTableRequest } from '../../../hooks/useTableRequest';

import * as S from './LessonsMain.mobile.styled';

const LessonsMainMobile = ({ searchLessons }) => {
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
      <>
        {loading ? (
          <S.Main gutter={[32, 16]}>
            <Col>
              <Skeleton avatar paragraph={{}} />
            </Col>
            <Col>
              <Skeleton avatar paragraph={{}} />
            </Col>
            <Col>
              <Skeleton avatar paragraph={{}} />
            </Col>
            <Col>
              <Skeleton avatar paragraph={{}} />
            </Col>
          </S.Main>
        ) : (
          <>
            <S.Main gutter={[32, 16]}>
              {dataSource.map((lesson) => (
                <S.Column key={lesson.id}>
                  <PublicLesson
                    getLessons={() =>
                      onChangeLessonsPagination(pagination.current)
                    }
                    lesson={lesson}
                  />
                </S.Column>
              ))}
            </S.Main>
            <Row justify="end">
              {pagination && (
                <S.Pages
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
      </>
    );
  }

  return (
    <S.Main>
      <S.Container
        image={emptyImg}
        description={t('user_home.open_lessons.not_found')}
      />
    </S.Main>
  );
};

LessonsMainMobile.defaultProps = {
  searchLessons: null,
};

LessonsMainMobile.propTypes = {
  searchLessons: PropTypes.string,
};

export default LessonsMainMobile;
