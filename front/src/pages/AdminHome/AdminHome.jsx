import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Empty,
  message,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { useTableRequest } from '@sb-ui/hooks/useTableRequest';
import { appointTeacher } from '@sb-ui/utils/api/v1/user';
import { MainDiv, TableHeader, TitleHeader } from './AdminHome.styled';
import { getUsers, removeTeacher } from '../../utils/api/v1/user/user';

const messageKey = 'teacherStateLoading';

const AdminHome = () => {
  const query = new URLSearchParams(useLocation().search);
  const { t } = useTranslation();
  const history = useHistory();
  const [teacherRoleState, setTeacherRoleState] = useState({});

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

  const handleTeacherRoleChange = useCallback(
    ({ isTeacher, userId }) =>
      async () => {
        setTeacherRoleState({
          ...teacherRoleState,
          [userId]: !isTeacher,
        });

        message.loading({ content: 'Loading...', key: messageKey });

        const requestFunc = isTeacher ? removeTeacher : appointTeacher;
        const response = await requestFunc(userId);

        if (response.status === 200) {
          const successMessage = t(response.data.key);

          message.success({
            content: successMessage,
            key: messageKey,
            duration: 2,
          });
        } else {
          const errorMessage = response.data?.errors?.[0]?.key
            ? t(response.data?.errors?.[0]?.key)
            : 'Error';

          message.error({
            content: errorMessage,
            key: messageKey,
            duration: 2,
          });
          setTeacherRoleState({
            ...teacherRoleState,
            [userId]: !!isTeacher,
          });
        }
      },
    [teacherRoleState, t],
  );

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
        dataIndex: 'isTeacher',
        key: 'isTeacher',
        render: (isTeacherDefault, user) => {
          const isTeacher =
            teacherRoleState[user.id] !== undefined
              ? teacherRoleState[user.id]
              : isTeacherDefault;
          return (
            <Checkbox
              checked={isTeacher}
              onChange={handleTeacherRoleChange({ isTeacher, userId: user.id })}
            />
          );
        },
        width: '20%',
      },
      {
        title: t('admin_home.table.action'),
        key: 'action',
        render: () => (
          <Space size="middle">
            <Typography.Link>{t('admin_home.table.edit')}</Typography.Link>
          </Space>
        ),
        width: '10%',
      },
    ],
    [t, teacherRoleState, handleTeacherRoleChange],
  );

  return (
    <MainDiv>
      <TableHeader justify="space-between" align="middle">
        <Col>
          <Row>
            <Space size="large">
              <TitleHeader level={3}>{t('admin_home.title')}</TitleHeader>
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
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('admin_home.table.no_data')}
            />
          ),
        }}
      />
    </MainDiv>
  );
};

export default AdminHome;
