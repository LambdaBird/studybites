import { useEffect, useMemo, useState } from 'react';
import { Col, Row, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import PublicLesson from '@sb-ui/pages/User/Home/PublicLessons/PublicLesson';
import { getPublicLessons } from '@sb-ui/utils/api/v1/lesson';
import { getQueryPage } from '@sb-ui/utils/utils';
import { USER_PUBLIC_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { PAGE_SIZE } from './constants';
import {
  LessonsColumn,
  LessonsEmpty,
  LessonsMainDiv,
  LessonsPagination,
} from './PublicLessons.desktop.styled';

const LessonsMainDesktop = ({ searchLessons }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryPage = useMemo(() => location.search, [location]);
  const history = useHistory();
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: responseData,
    isLoading,
    isPreviousData,
    isSuccess,
  } = useQuery(
    [
      USER_PUBLIC_LESSONS_BASE_KEY,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search,
      },
    ],
    getPublicLessons,
    { keepPreviousData: true },
  );

  const { data, total } = responseData || {};

  useEffect(() => {
    if (data?.length === 0 && total !== 0) {
      setCurrentPage(1);
      history.replace({
        search: ``,
      });
    }
  }, [data, history, total]);

  useEffect(() => {
    const { incorrect, page } = getQueryPage(queryPage);
    setCurrentPage(page);
    if (incorrect || page === 1) {
      history.replace({
        search: ``,
      });
    }
  }, [history, queryPage]);

  useEffect(() => {
    setSearch(searchLessons);
  }, [searchLessons]);

  const onChangeLessonsPage = (page) => {
    setCurrentPage(page);
    history.push({
      search: `?page=${page}`,
    });
  };

  if (isSuccess && data?.length === 0) {
    return (
      <LessonsMainDiv>
        <LessonsEmpty
          image={emptyImg}
          description={t('user_home.open_lessons.not_found')}
        />
      </LessonsMainDiv>
    );
  }

  return (
    <LessonsMainDiv>
      {isLoading || isPreviousData ? (
        <Row gutter={[16, 16]}>
          <Col lg={{ span: 12 }} md={{ span: 24 }}>
            <Skeleton avatar />
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 24 }}>
            <Skeleton avatar />
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 24 }}>
            <Skeleton avatar />
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 24 }}>
            <Skeleton avatar />
          </Col>
        </Row>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {data?.map((lesson) => (
              <LessonsColumn
                key={lesson.id}
                lg={{ span: 12 }}
                md={{ span: 24 }}
              >
                <PublicLesson lesson={lesson} />
              </LessonsColumn>
            ))}
          </Row>
          <Row justify="end">
            {!isLoading && total > PAGE_SIZE && (
              <LessonsPagination
                current={currentPage}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={onChangeLessonsPage}
                showSizeChanger={false}
              />
            )}
          </Row>
        </>
      )}
    </LessonsMainDiv>
  );
};

LessonsMainDesktop.defaultProps = {
  searchLessons: null,
};

LessonsMainDesktop.propTypes = {
  searchLessons: PropTypes.string,
};

export default LessonsMainDesktop;
