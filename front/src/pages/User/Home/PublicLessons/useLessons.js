import { useHistory, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { USER_PUBLIC_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { PAGE_SIZE } from '@sb-ui/pages/User/Home/PublicLessons/constants';
import { getPublicLessons } from '@sb-ui/utils/api/v1/student';
import { getQueryPage } from '@sb-ui/utils/utils';

export const useLessons = (searchLessons) => {
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
      USER_PUBLIC_LESSONS_BASE_KEY,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search,
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

  useEffect(() => {
    setSearch(searchLessons);
  }, [searchLessons]);

  const onChangeLessonsPage = useCallback(
    (page) => {
      setCurrentPage(page);
      history.push({
        search: `?page=${page}`,
      });
    },
    [history],
  );

  return {
    data,
    total,
    currentPage,
    isLoading,
    isPreviousData,
    isSuccess,
    onChangeLessonsPage,
  };
};
