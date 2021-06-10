import { useCallback, useState } from 'react';

export const useTableRequest = ({
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
      const isSearch = search !== currentSearch;
      if (isSearch) {
        setCurrentPage(1);
      } else {
        setCurrentPage(current);
      }
      setCurrentSearch(search);

      let { status, data } = await requestFunc({
        offset: isSearch ? 0 : (current - 1) * pageSize,
        limit: pageSize,
        search,
      });
      const wrongPage = data?.total !== 0 && data?.data?.length === 0;
      if (wrongPage) {
        const response = await requestFunc({
          offset: 0,
          limit: pageSize,
          search,
        });
        status = response.status;
        data = response.data;
      }
      setLoading(false);

      if (search !== currentSearch) {
        onChangePage(1);
      } else {
        onChangePage(current, wrongPage);
      }

      if (status === 200) {
        if (data.total <= pageSize) {
          setPagination(false);
        } else {
          setPagination({
            showSizeChanger: false,
            current: isSearch || wrongPage ? 1 : current,
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
