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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import {
  appointTeacher,
  getUsers,
  removeTeacher,
} from '@sb-ui/utils/api/v1/admin';
import { ADMIN_USERS_BASE_KEY } from '@sb-ui/utils/queries';
import { getQueryPage } from '@sb-ui/utils/utils';

import * as S from './Home.styled';

const messageKey = 'teacherStateLoading';

const PAGE_SIZE = 10;

const Home = () => {
  const { t } = useTranslation('admin');
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
        title: t('home.table.full_name'),
        dataIndex: 'fullName',
        key: 'fullName',
        width: '35%',
      },
      {
        title: t('home.table.email'),
        dataIndex: 'email',
        key: 'email',
        width: '35%',
      },
      {
        title: t('home.table.role'),
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
        title: t('home.table.action'),
        key: 'action',
        render: () => (
          <Space size="middle">
            <Typography.Link>{t('home.table.edit')}</Typography.Link>
          </Space>
        ),
        width: '10%',
      },
    ],
    [t, teacherRoleState, handleTeacherRoleChange],
  );

  return (
    <S.MainDiv>
      <S.TableHeader>
        <Col>
          <Row>
            <Space size="large">
              <S.TitleHeader>{t('home.title')}</S.TitleHeader>
              <DebouncedSearch
                delay={500}
                placeholder={t('home.search.placeholder')}
                allowClear
                onChange={setSearch}
              />
            </Space>
          </Row>
        </Col>
        <Col>
          <Button disabled>{t('home.buttons.add_user')}</Button>
        </Col>
      </S.TableHeader>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(row) => row.id}
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
              description={t('home.table.no_data')}
            />
          ),
        }}
      />
    </S.MainDiv>
  );
};

export default Home;
