import { Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';

import OngoingFullLesson from '@sb-ui/components/lessonBlocks/OngoingFull';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import { skeletonArray } from '@sb-ui/utils/utils';

import { PAGE_SIZE } from './constants';
import * as S from './LessonsList.styled';

const LessonsList = ({ title, notFound, query }) => {
  const { key: queryKey, func: queryFunc } = query;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(null);

  const { isLoading, data: responseData } = useQuery(
    [
      queryKey,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: searchText,
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

LessonsList.propTypes = {
  title: PropTypes.string.isRequired,
  notFound: PropTypes.string.isRequired,
  query: PropTypes.shape({
    key: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
  }),
};

export default LessonsList;
