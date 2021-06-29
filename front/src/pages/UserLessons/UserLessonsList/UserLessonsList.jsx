import { useState } from 'react';
import { Skeleton } from 'antd';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';

import UserLesson from '@sb-ui/pages/UserLessons/UserLesson';

import emptyImg from '@sb-ui/resources/img/empty.svg';
import { useTranslation } from 'react-i18next';
import * as S from './UserLessonsList.styled';

const PAGE_SIZE = 10;

const UserLessonsList = ({ title, query }) => {
  const { t } = useTranslation();
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
        <S.OpenLessonsTitle level={4}>{title}</S.OpenLessonsTitle>
        <S.StyledSearch
          searchText={searchText}
          setSearchText={setSearchText}
          placement="bottomLeft"
        />
      </S.LessonsHeader>
      <S.LessonsRow gutter={[32, 32]}>
        {isLoading
          ? Array(PAGE_SIZE)
              .fill()
              .map(() => (
                <S.LessonCol lg={{ span: 12 }} md={{ span: 24 }}>
                  <Skeleton avatar />
                </S.LessonCol>
              ))
          : lessons?.map((lesson) => (
              <S.LessonCol key={lesson.id} lg={{ span: 12 }} md={{ span: 24 }}>
                <UserLesson lesson={lesson} />
              </S.LessonCol>
            ))}
        {!isLoading && total === 0 && lessons?.length === 0 && (
          <S.EmptyContainer
            image={emptyImg}
            description={t('user_home.open_lessons.not_found')}
          />
        )}
      </S.LessonsRow>
      {!isLoading && total > PAGE_SIZE && (
        <S.StyledPagination
          current={currentPage}
          total={total}
          pageSize={PAGE_SIZE}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      )}
    </S.Wrapper>
  );
};

UserLessonsList.propTypes = {
  title: PropTypes.string.isRequired,
  query: PropTypes.shape({
    key: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
  }),
};

export default UserLessonsList;
