import { useCallback, useState } from 'react';

const useTableRequest = ({ requestFunc, onChangePage = () => {} }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState();
  const [currentSearch, setCurrentSearch] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [currentPageSize, setCurrentPageSize] = useState();

  const handleTableChange = useCallback(
    async ({
      current = currentPage,
      pageSize = currentPageSize,
      search = currentSearch,
    }) => {
      setLoading(true);
      setCurrentPageSize(pageSize);
      if (search !== currentSearch) {
        setCurrentPage(1);
      } else {
        setCurrentPage(current);
      }
      setCurrentSearch(search);

      const { status, data } = await requestFunc({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        search,
      });
      setLoading(false);
      onChangePage(current);
      if (status === 200) {
        setDataSource(data.data);
        setPagination({
          showSizeChanger: false,
          current,
          pageSize,
          total: data.total,
        });
      }
    },
    [currentPage, currentPageSize, currentSearch, onChangePage, requestFunc],
  );

  return {
    loading,
    dataSource,
    handleTableChange,
    pagination,
  };
};

export default useTableRequest;
