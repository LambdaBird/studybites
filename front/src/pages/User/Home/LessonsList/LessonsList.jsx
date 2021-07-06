import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getQueryPage } from '@sb-ui/utils/utils';
import { PAGE_SIZE } from '@sb-ui/pages/User/Lessons/LessonsList/constants';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import { USER_PUBLIC_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { getPublicLessons } from '@sb-ui/utils/api/v1/student';
import * as S from '@sb-ui/pages/User/Lessons/LessonsList/LessonsList.styled';
import LessonsListBlock from './LessonsListBlock';

const LessonsList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryPage = useMemo(() => location.search, [location]);
  const history = useHistory();
  const [searchText, setSearchText] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: responseData, isLoading } = useQuery(
    [
      USER_PUBLIC_LESSONS_BASE_KEY,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: searchText,
      },
    ],
    getPublicLessons,
    { keepPreviousData: true },
  );

  const { data, total } = useMemo(() => responseData || {}, [responseData]);

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

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      history.push({
        search: `?page=${page}`,
      });
    },
    [history],
  );

  const isEmpty = !isLoading && total === 0 && data?.length === 0;
  const isPaginationDisplayed = !isLoading && total > PAGE_SIZE;
  return (
    <S.Wrapper>
      <S.LessonsHeader>
        <S.OpenLessonsTitle level={4}>
          {t('user_home.open_lessons.title')}
        </S.OpenLessonsTitle>
        <S.StyledSearch
          searchText={searchText}
          setSearchText={setSearchText}
          placement="bottomLeft"
        />
      </S.LessonsHeader>
      <S.LessonsRow gutter={[32, 32]}>
        <LessonsListBlock isLoading={isLoading} data={data} />
        {isEmpty && (
          <S.EmptyContainer
            image={emptyImg}
            description={t('user_home.open_lessons.not_found')}
          />
        )}
      </S.LessonsRow>
      {isPaginationDisplayed && (
        <S.StyledPagination
          current={currentPage}
          total={total}
          pageSize={PAGE_SIZE}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      )}
    </S.Wrapper>
  );
};

export default LessonsList;
