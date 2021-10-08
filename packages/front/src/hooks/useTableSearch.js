import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';

import { getQueryPage } from '@sb-ui/utils/utils';

export const useTableSearch = ({
  baseKey,
  getFunc,
  pageSize = 10,
  params = {},
  dataKey = 'data',
}) => {
  const history = useHistory();
  const location = useLocation();
  const queryPage = useMemo(() => location.search, [location]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(null);

  const {
    data: responseData,
    isLoading,
    isPreviousData,
  } = useQuery(
    [
      baseKey,
      {
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
        search,
        ...params,
      },
    ],
    getFunc,
    { keepPreviousData: true },
  );

  const { total } = responseData || {};
  const data = responseData?.[dataKey];

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
    ({ current }) => {
      setCurrentPage(current);
      history.push({
        search: `?page=${current}`,
      });
    },
    [history],
  );

  return {
    isLoading,
    isPreviousData,
    setSearch,
    data,
    total,
    onChangeLessonsPage,
    currentPage,
  };
};
