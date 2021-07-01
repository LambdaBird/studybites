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
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { appointTeacher } from '@sb-ui/utils/api/v1/user';
import { getQueryPage } from '@sb-ui/utils/utils';
import { ADMIN_USERS_BASE_KEY } from '@sb-ui/utils/queries';
import { getUsers, removeTeacher } from '@sb-ui/utils/api/v1/user/user';
import { MainDiv, TableHeader, TitleHeader } from './Home.styled';

const messageKey = 'teacherStateLoading';

const PAGE_SIZE = 10;

const Home = () => {
  const { t } = useTranslation();
  const [teacherRoleState, setTeacherRoleState] = useState({});

  const location = useLocation();
  const queryPage = useMemo(() => location.search, [location]);
  const history = useHistory();
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: responseData,
    isLoading,
    isPreviousData,
  } = useQuery(
    [
      ADMIN_USERS_BASE_KEY,
      {
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search,
      },
    ],
    getUsers,
    { keepPreviousData: true },
  );

  const { data, total } = responseData || {};

  useEffect(() => {
    if (data?.length === 0 && total !== 0) {
      setCurrentPage(1);
      history.replace({
        search: ``,
      });
    }
  }, [data, history, total]);

  useEffect(() => {
    const { incorrect, page } = getQueryPage(queryPage);
    setCurrentPage(page);
    if (incorrect || page === 1) {
      history.replace({
        search: ``,
      });
    }
  }, [history, queryPage]);

  const onChangeLessonsPage = ({ current }) => {
    setCurrentPage(current);
    history.push({
      search: `?page=${current}`,
    });
  };

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
                onChange={setSearch}
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
        dataSource={data}
        pagination={
          !isLoading &&
          total > PAGE_SIZE && {
            showSizeChanger: false,
            current: currentPage,
            pageSize: PAGE_SIZE,
            total,
          }
        }
        onChange={onChangeLessonsPage}
        loading={isLoading || isPreviousData}
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

export default Home;
