import { useCallback, useState } from 'react';

const useTableRequest = ({ requestFunc, onChangePage = () => {} }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState();

  const handleTableChange = useCallback(
    async ({ current, pageSize }) => {
      setLoading(true);
      const { status, data } = await requestFunc({
        offset: (current - 1) * pageSize,
        limit: pageSize,
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
    [onChangePage, requestFunc],
  );

  return {
    loading,
    dataSource,
    handleTableChange,
    pagination,
  };
};

export default useTableRequest;
