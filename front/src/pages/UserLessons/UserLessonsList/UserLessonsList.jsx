import { useState } from 'react';
import { Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { USER_ENROLLED_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { getEnrolledLessons } from '@sb-ui/utils/api/v1/lesson';
import UserLesson from '@sb-ui/pages/UserLessons/UserLesson';

import * as S from './UserLessonsList.styled';

const PAGE_SIZE = 10;

const UserLessonsList = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(null);

  const { isLoading, data: responseData } = useQuery(
    [
      USER_ENROLLED_LESSONS_BASE_KEY,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: searchText,
      },
    ],
    getEnrolledLessons,
    { keepPreviousData: true },
  );
  const { data: lessons, total } = responseData || {};

  return (
    <S.Wrapper>
      <S.LessonsHeader justify="space-between">
        <S.OpenLessonsTitle level={4}>
          {t('user_lessons.ongoing_lessons.title')}
        </S.OpenLessonsTitle>
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
          : lessons.map((lesson) => (
              <S.LessonCol key={lesson.id} lg={{ span: 12 }} md={{ span: 24 }}>
                <UserLesson lesson={lesson} />
              </S.LessonCol>
            ))}
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

export default UserLessonsList;
