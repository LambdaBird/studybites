import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { FilterOutlined } from '@sb-ui/components/Icons';
import FilterMobile from '@sb-ui/components/molecules/FilterMobile';
import KeywordsFilter from '@sb-ui/components/molecules/KeywordsFilter';
import useMobile from '@sb-ui/hooks/useMobile';
import { PAGE_SIZE } from '@sb-ui/pages/User/Lessons/ResourcesList/constants';
import * as S from '@sb-ui/pages/User/Lessons/ResourcesList/ResourcesList.styled';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import { getCourses } from '@sb-ui/utils/api/v1/courses';
import { fetchKeywords } from '@sb-ui/utils/api/v1/keywords';
import { USER_PUBLIC_COURSES_BASE_KEY } from '@sb-ui/utils/queries';

import OpenCoursesBlock from '../OpenResourcesBlock';

const OpenCourses = () => {
  const { t } = useTranslation('user');
  const [searchText, setSearchText] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [keywords, setKeywords] = useState([]);
  const isMobile = useMobile();

  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery(
    [
      USER_PUBLIC_COURSES_BASE_KEY,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: searchText,
        tags: keywords,
      },
    ],
    getCourses,
    { keepPreviousData: true },
  );

  const { courses, total } = useMemo(() => responseData || {}, [responseData]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const isEmpty = !isLoading && total === 0 && courses?.length === 0;
  const isPaginationDisplayed = !isLoading && total > PAGE_SIZE;
  return (
    <S.Wrapper>
      <S.LessonsHeader>
        <S.OpenLessonsTitle>{t('home.open_courses.title')}</S.OpenLessonsTitle>
        <S.FilterWrapper>
          <S.StyledSearch
            searchText={searchText}
            setSearchText={setSearchText}
          />
          {isMobile ? (
            <>
              <FilterMobile
                icon={<FilterOutlined />}
                fetchData={fetchKeywords}
                setData={setKeywords}
              />
            </>
          ) : (
            <>
              <KeywordsFilter setValues={setKeywords} />
            </>
          )}
        </S.FilterWrapper>
      </S.LessonsHeader>
      <S.LessonsRow>
        <OpenCoursesBlock
          isLoading={isLoading}
          error={error}
          data={courses}
          isCourse
        />
        {isEmpty && (
          <S.EmptyContainer
            image={emptyImg}
            description={t('home.open_courses.not_found')}
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

export default OpenCourses;
