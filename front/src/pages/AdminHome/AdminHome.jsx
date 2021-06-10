import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
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
import { normalizeQueryPage } from '@sb-ui/utils/utils';
import { MainDiv, TableHeader } from './AdminHome.styled';
import { getUsers, removeTeacher } from '../../utils/api/v1/user/user';

const { Title } = Typography;

const messageKey = 'teacherStateLoading';

const AdminHome = () => {
  const PAGE_SIZE = 2;
  const page = normalizeQueryPage(useLocation().search);
  const { t } = useTranslation();
  const history = useHistory();
  const [teacherRoleState, setTeacherRoleState] = useState({});
  const onChangePage = useCallback(
    (current, wrongPage) => {
      const pageParam = normalizeQueryPage(history.location.search);
      if (wrongPage || current === 1) {
        history.replace({
          search: ``,
        });
      } else if (pageParam !== current) {
        history.push({
          search: `?page=${current}`,
        });
      }
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
    handleTableChange({
      current: page,
      pageSize: PAGE_SIZE,
      firstTime: true,
    });
  }, [page]);

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
    [t, teacherRoleState, handleTeacherRoleChange],
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
