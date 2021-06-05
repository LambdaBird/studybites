import { useCallback, useState } from 'react';

const useTableRequest = ({
  requestFunc,
  onChangePage = () => {},
  defaultPagination,
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(defaultPagination);
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
        if (data.total <= pageSize) {
          setPagination(false);
        } else {
          setPagination({
            showSizeChanger: false,
            current,
            pageSize,
            total: data.total,
          });
        }

        setDataSource(data.data);
      }
    },
    [currentPage, currentPageSize, currentSearch, onChangePage, requestFunc],
  );

  return {
    currentPage,
    loading,
    dataSource,
    handleTableChange,
    pagination,
  };
};

export default useTableRequest;
