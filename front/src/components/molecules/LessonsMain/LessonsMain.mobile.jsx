import { useEffect, useMemo, useState } from 'react';
import { Col, Row, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import emptyImg from '@sb-ui/resources/img/empty.svg';
import PublicLesson from '@sb-ui/components/atoms/PublicLesson';
import {
  getEnrolledLessons,
  getPublicLessons,
} from '@sb-ui/utils/api/v1/lesson/lesson';
import OngoingLesson from '@sb-ui/components/atoms/OngoingLesson';

import { useQuery } from 'react-query';
import {
  PAGE_SIZE,
  USER_ENROLLED_LESSONS_BASE_KEY,
  USER_PUBLIC_LESSONS_BASE_KEY,
} from '@sb-ui/components/molecules/LessonsMain/constants';
import { getQueryPage } from '@sb-ui/utils/utils';
import * as S from './LessonsMain.mobile.styled';

const LessonsMainMobile = ({ searchLessons, isOngoingLesson }) => {
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
      isOngoingLesson
        ? USER_PUBLIC_LESSONS_BASE_KEY
        : USER_ENROLLED_LESSONS_BASE_KEY,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search,
      },
    ],
    isOngoingLesson ? getEnrolledLessons : getPublicLessons,
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
      <S.Main>
        <S.Container
          image={emptyImg}
          description={t('user_home.open_lessons.not_found')}
        />
      </S.Main>
    );
  }

  return (
    <>
      {isLoading || isPreviousData ? (
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
            {data?.map((lesson) => (
              <S.Column key={lesson.id}>
                {isOngoingLesson ? (
                  <OngoingLesson lesson={lesson} />
                ) : (
                  <PublicLesson lesson={lesson} />
                )}
              </S.Column>
            ))}
            <Row justify="end">
              {!isLoading && total > PAGE_SIZE && (
                <S.Pages
                  current={currentPage}
                  total={total}
                  pageSize={PAGE_SIZE}
                  onChange={onChangeLessonsPage}
                  showSizeChanger={false}
                />
              )}
            </Row>
          </S.Main>
        </>
      )}
    </>
  );
};

LessonsMainMobile.defaultProps = {
  searchLessons: null,
  isOngoingLesson: false,
};

LessonsMainMobile.propTypes = {
  searchLessons: PropTypes.string,
  isOngoingLesson: PropTypes.bool,
};

export default LessonsMainMobile;
