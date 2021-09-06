import { Skeleton } from 'antd';
import { useState } from 'react';
import { useQuery } from 'react-query';

import OngoingFullLesson from '@sb-ui/components/lessonBlocks/OngoingFull';
import AuthorSelect from '@sb-ui/components/molecules/AuthorSelect';
import KeywordsFilter from '@sb-ui/components/molecules/KeywordsFilter';
import KeywordsFilterMobile from '@sb-ui/components/molecules/KeywordsFilterMobile';
import useMobile from '@sb-ui/hooks/useMobile';
import emptyImg from '@sb-ui/resources/img/empty.svg';
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
        <S.StyledSearch searchText={searchText} setSearchText={setSearchText} />
        <S.AuthorWrapper>
          <AuthorSelect values={authors} setValues={setAuthors} />
        </S.AuthorWrapper>
        <S.FilterWrapper>
          {isMobile ? (
            <KeywordsFilterMobile setKeywords={setKeywords} />
          ) : (
            <KeywordsFilter setValues={setKeywords} />
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
