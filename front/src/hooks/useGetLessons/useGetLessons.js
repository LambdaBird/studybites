import { useState, useCallback, useEffect } from 'react';
import { getLessons } from '../../utils/api/v1/lesson';

const useGetLessons = (pageLimitValue, initialPage) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lessonsData, setLessonsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageLimit, setPageLimit] = useState(pageLimitValue);
  const [searchReq, setSearchReq] = useState(null);
  const [filterReq, setFilterReq] = useState(null);
  const [totalPage, setTotalPage] = useState(null);
  const [isPagination, setIsPagination] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterReq]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchReq]);

  const getLessonsRequest = useCallback(async () => {
    setLessonsData(null);
    setIsLoading(true);
    const {
      status,
      data: { total },
      data: { data },
    } = await getLessons({
      offset: (currentPage - 1) * pageLimit,
      pageLimit,
      searchReq,
      filterReq,
    });
    setIsLoading(false);

    if (status === 200) {
      setTotalPage(total);
      setLessonsData(data);
      setIsPagination(true);
    }
  }, [currentPage, searchReq, filterReq, pageLimit]);

  return {
    getLessonsRequest,
    lessonsData,
    isLoading,
    pagination: {
      currentPage,
      totalPage,
      pageLimit,
      isPagination,
    },
    actions: {
      search: setSearchReq,
      filter: setFilterReq,
      changePage: setCurrentPage,
      changePageLimit: setPageLimit,
    },
  };
};

export default useGetLessons;
