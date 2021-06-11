import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getQueryPage } from '@sb-ui/utils/utils';

export const useTableRequest = ({ requestFunc, pageSize }) => {
  const location = useLocation();
  const queryPage = useMemo(() => location.search, [location]);
  const history = useHistory();

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState();
  const [search, setSearch] = useState(null);

  const getData = async (page = 1) => {
    setLoading(true);
    const { status, data } = await requestFunc({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      search,
    });
    setLoading(false);
    if (status === 200) {
      return {
        total: data?.total,
        data: data?.data,
      };
    }
    return {
      total: 0,
      data: [],
    };
  };

  const handleTableChange = async ({ current = 1 }) => {
    const { total, data } = await getData(current);
    if (total !== 0 && data.length === 0) {
      history.replace({
        search: '',
      });
    }
    const { page } = getQueryPage(queryPage);
    if (page !== current) {
      if (current === 1) {
        history.push({
          search: ``,
        });
      } else {
        history.push({
          search: `?page=${current}`,
        });
      }
    }
    if (total <= pageSize) {
      setPagination(false);
    } else {
      setPagination({
        showSizeChanger: false,
        current,
        pageSize,
        total,
      });
    }
    setDataSource(data);
  };

  const handleTableSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    if (search !== null) {
      handleTableChange({});
    }
  }, [search]);

  useEffect(() => {
    const { incorrect, page } = getQueryPage(queryPage);
    if (incorrect) {
      history.replace({
        search: '',
      });
    }
    setSearch(null);
    handleTableChange({ current: page });
  }, [queryPage]);

  return {
    loading,
    dataSource,
    pagination,
    handleTableChange,
    handleTableSearch,
  };
};
