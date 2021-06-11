import { useCallback, useMemo, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { useTableRequest } from '@sb-ui/hooks/useTableRequest';
import { appointTeacher } from '@sb-ui/utils/api/v1/user';
import { MainDiv, TableHeader } from './AdminHome.styled';
import { getUsers, removeTeacher } from '../../utils/api/v1/user/user';

const { Title } = Typography;

const messageKey = 'teacherStateLoading';

const PAGE_SIZE = 10;

const AdminHome = () => {
  const { t } = useTranslation();
  const [teacherRoleState, setTeacherRoleState] = useState({});

  const {
    loading,
    dataSource,
    pagination,
    handleTableSearch,
    handleTableChange,
  } = useTableRequest({
    requestFunc: getUsers,
    pageSize: PAGE_SIZE,
  });

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
                onChange={handleTableSearch}
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
