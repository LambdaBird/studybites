import * as S from '@sb-ui/pages/User/Lessons/LessonsList/LessonsList.styled';
import { getQueryPage, skeletonArray } from '@sb-ui/utils/utils';
import { PAGE_SIZE } from '@sb-ui/pages/User/Lessons/LessonsList/constants';
import { Skeleton } from 'antd';
import PublicLesson from '@sb-ui/components/lessonBlocks/Public';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { USER_PUBLIC_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { getPublicLessons } from '@sb-ui/utils/api/v1/student';

const LessonsList = () => {
  const { t } = useTranslation('user');
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

  const onChangeLessonsPage = useCallback(
    (page) => {
      setCurrentPage(page);
      history.push({
        search: `?page=${page}`,
      });
    },
    [history],
  );

  return (
    <S.Wrapper>
      <S.LessonsHeader>
        <S.OpenLessonsTitle level={4}>
          {t('home.open_lessons.title')}
        </S.OpenLessonsTitle>
        <S.StyledSearch
          searchText={searchText}
          setSearchText={setSearchText}
          placement="bottomLeft"
        />
      </S.LessonsHeader>
      <S.LessonsRow gutter={[32, 32]}>
        {isLoading
          ? skeletonArray(PAGE_SIZE).map((el) => (
              <S.LessonCol key={el.id} lg={{ span: 12 }} md={{ span: 24 }}>
                <Skeleton avatar />
              </S.LessonCol>
            ))
          : data?.map((lesson) => (
              <S.LessonCol key={lesson.id} lg={{ span: 12 }} md={{ span: 24 }}>
                <PublicLesson lesson={lesson} />
              </S.LessonCol>
            ))}
        {!isLoading && total === 0 && data?.length === 0 && (
          <S.EmptyContainer
            image={emptyImg}
            description={t('home.open_lessons.not_found')}
          />
        )}
      </S.LessonsRow>
      {!isLoading && total > PAGE_SIZE && (
        <S.StyledPagination
          current={currentPage}
          total={total}
          pageSize={PAGE_SIZE}
          onChange={onChangeLessonsPage}
          showSizeChanger={false}
        />
      )}
    </S.Wrapper>
  );
};

export default LessonsList;
