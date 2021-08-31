import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';

import KeywordsFilter from '@sb-ui/components/molecules/KeywordsFilter';
import { PAGE_SIZE } from '@sb-ui/pages/User/Lessons/LessonsList/constants';
import * as S from '@sb-ui/pages/User/Lessons/LessonsList/LessonsList.styled';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import { getPublicLessons } from '@sb-ui/utils/api/v1/student';
import { USER_PUBLIC_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { getQueryPage } from '@sb-ui/utils/utils';

import OpenLessonsBlock from './OpenLessonsBlock';

const OpenLessons = () => {
  const { t } = useTranslation('user');
  const location = useLocation();
  const queryPage = useMemo(() => location.search, [location]);
  const history = useHistory();
  const [searchText, setSearchText] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [keywords, setKeywords] = useState([]);

  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery(
    [
      USER_PUBLIC_LESSONS_BASE_KEY,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: searchText,
        tags: keywords,
      },
    ],
    getPublicLessons,
    { keepPreviousData: true },
  );

  const { lessons, total } = useMemo(() => responseData || {}, [responseData]);

  useEffect(() => {
    if (lessons?.length === 0 && total !== 0) {
      setCurrentPage(1);
      history.replace({
        search: ``,
      });
    }
  }, [lessons, history, total]);

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

  const isEmpty = !isLoading && total === 0 && lessons?.length === 0;
  const isPaginationDisplayed = !isLoading && total > PAGE_SIZE;
  return (
    <S.Wrapper>
      <S.LessonsHeader>
        <S.OpenLessonsTitle>{t('home.open_lessons.title')}</S.OpenLessonsTitle>
        <S.StyledSearch searchText={searchText} setSearchText={setSearchText} />
        <KeywordsFilter setValues={setKeywords} />
      </S.LessonsHeader>
      <S.LessonsRow>
        <OpenLessonsBlock isLoading={isLoading} error={error} data={lessons} />
        {isEmpty && (
          <S.EmptyContainer
            image={emptyImg}
            description={t('home.open_lessons.not_found')}
          />
        )}
      </S.LessonsRow>
      {isPaginationDisplayed && (
        <S.StyledPagination
          current={currentPage}
          total={total}
          pageSize={PAGE_SIZE}
          onChange={handlePageChange}
        />
      )}
    </S.Wrapper>
  );
};

export default OpenLessons;
