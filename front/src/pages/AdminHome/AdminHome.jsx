import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Col, Row, Select, Space, Table, Typography } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FullSelect, MainDiv, TableHeader } from './AdminHome.styled';
import { getUsers } from '../../utils/api/v1/user/user';
import useTableRequest from '../../hooks/useTableRequest';
import DebouncedSearch from '../../components/atoms/DebouncedSearch';

const { Option } = Select;
const { Title } = Typography;

const AdminHome = () => {
  const query = new URLSearchParams(useLocation().search);
  const { t } = useTranslation();
  const history = useHistory();

  const onChangePage = useCallback(
    (current) => {
      history.push({
        search: `?page=${current}`,
      });
    },
    [history],
  );

  const { loading, dataSource, pagination, handleTableChange } =
    useTableRequest({
      requestFunc: getUsers,
      onChangePage,
    });

  const handleSearchChange = (data) => {
    handleTableChange({
      search: data,
    });
  };

  useEffect(() => {
    const page = parseInt(query.get('page'), 10) || 1;
    handleTableChange({
      current: page < 0 ? 1 : page,
      pageSize: 10,
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        title: t('admin_home.table.full_name'),
        dataIndex: 'fullName',
        key: 'fullName',
        width: '35%',
      },
      {
        title: t('admin_home.table.email'),
        dataIndex: 'email',
        key: 'email',
        width: '35%',
      },
      {
        title: t('admin_home.table.role'),
        dataIndex: 'role',
        key: 'role',
        render: (role) => (
          <FullSelect defaultValue={role}>
            <Option value="teacher">
              {t('admin_home.table.select_teacher')}
            </Option>
            <Option value="student">
              {t('admin_home.table.select_student')}
            </Option>
          </FullSelect>
        ),
        width: '20%',
      },
      {
        title: 'Action',
        key: 'action',
        render: () => (
          <Space size="middle">
            <Typography.Link>{t('admin_home.table.edit')}</Typography.Link>
          </Space>
        ),
        width: '10%',
      },
    ],
    [t],
  );

  return (
    <MainDiv>
      <TableHeader justify="space-between" align="middle">
        <Col>
          <Row>
            <Space size="large">
              <Title level={2}>{t('admin_home.title')}</Title>
              <DebouncedSearch
                delay={500}
                placeholder={t('admin_home.search.placeholder')}
                allowClear
                onChange={handleSearchChange}
              />
            </Space>
          </Row>
        </Col>
        <Col>
          <Button disabled>{t('admin_home.buttons.add_user')}</Button>
        </Col>
      </TableHeader>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
      />
    </MainDiv>
  );
};

export default AdminHome;
