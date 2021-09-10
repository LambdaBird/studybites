import { Skeleton } from 'antd';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { FilterOutlined, UserOutlined } from '@ant-design/icons';

import AuthorSelect from '@sb-ui/components/molecules/AuthorSelect';
import FilterMobile from '@sb-ui/components/molecules/FilterMobile';
import KeywordsFilter from '@sb-ui/components/molecules/KeywordsFilter';
import OngoingFullLesson from '@sb-ui/components/resourceBlocks/OngoingFull';
import useMobile from '@sb-ui/hooks/useMobile';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import { fetchKeywords } from '@sb-ui/utils/api/v1/keywords';
import { fetchAuthors } from '@sb-ui/utils/api/v1/user';
import { skeletonArray } from '@sb-ui/utils/utils';

import { PAGE_SIZE } from './constants';
import { LessonsListPropTypes } from './types';
import * as S from './LessonsList.styled';

const LessonsList = ({ title, notFound, query }) => {
  const { key: queryKey, func: queryFunc } = query;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const isMobile = useMobile();

  const { isLoading, data: responseData } = useQuery(
    [
      queryKey,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: searchText,
        authors,
        tags: keywords,
      },
    ],
    queryFunc,
    { keepPreviousData: true },
  );
  const { lessons, total } = responseData || {};

  return (
    <S.Wrapper>
      <S.LessonsHeader>
        <S.OpenLessonsTitle>{title}</S.OpenLessonsTitle>
        <S.FilterWrapper>
          <S.StyledSearch
            searchText={searchText}
            setSearchText={setSearchText}
          />
          {isMobile ? (
            <>
              <FilterMobile
                icon={<UserOutlined />}
                fetchData={fetchAuthors}
                setData={setAuthors}
              />
              <FilterMobile
                icon={<FilterOutlined />}
                fetchData={fetchKeywords}
                setData={setKeywords}
              />
            </>
          ) : (
            <>
              <AuthorSelect values={authors} setValues={setAuthors} />
              <KeywordsFilter setValues={setKeywords} />
            </>
          )}
        </S.FilterWrapper>
      </S.LessonsHeader>
      <S.LessonsRow>
        {isLoading
          ? skeletonArray(PAGE_SIZE).map((el) => (
              <S.LessonCol key={el.id}>
                <Skeleton avatar />
              </S.LessonCol>
            ))
          : lessons?.map((lesson) => (
              <S.LessonCol key={lesson.id}>
                <OngoingFullLesson lesson={lesson} />
              </S.LessonCol>
            ))}
        {!isLoading && total === 0 && lessons?.length === 0 && (
          <S.EmptyContainer image={emptyImg} description={notFound} />
        )}
      </S.LessonsRow>
      {!isLoading && total > PAGE_SIZE && (
        <S.StyledPagination
          current={currentPage}
          total={total}
          pageSize={PAGE_SIZE}
          onChange={setCurrentPage}
        />
      )}
    </S.Wrapper>
  );
};

LessonsList.propTypes = LessonsListPropTypes;

export default LessonsList;
