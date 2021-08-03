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
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { useTableSearch } from '@sb-ui/hooks/useTableSearch';
import {
  appointTeacher,
  getUsers,
  removeTeacher,
} from '@sb-ui/utils/api/v1/admin';
import { ADMIN_USERS_BASE_KEY } from '@sb-ui/utils/queries';

import * as S from './Home.styled';

const messageKey = 'teacherStateLoading';

const PAGE_SIZE = 10;

const Home = () => {
  const { t } = useTranslation('admin');
  const [teacherRoleState, setTeacherRoleState] = useState({});

  const {
    setSearch,
    data,
    total,
    onChangeLessonsPage,
    isLoading,
    isPreviousData,
    currentPage,
  } = useTableSearch({
    baseKey: ADMIN_USERS_BASE_KEY,
    getFunc: getUsers,
    pageSize: PAGE_SIZE,
  });

  const onSuccessChangeTeacher = useCallback(
    (changeData) => {
      const content = t(changeData.message);
      message.success({
        content,
        key: messageKey,
        duration: 2,
      });
    },
    [t],
  );

  const onErrorChangeTeacher = useCallback(
    ({ error, userId, isTeacher }) => {
      const errorResponseKey = error.response.data?.message;
      const errorMessage = errorResponseKey ? t(errorResponseKey) : 'Error';
      const content = t(errorMessage);
      message.error({
        content,
        key: messageKey,
        duration: 2,
      });
      setTeacherRoleState({
        ...teacherRoleState,
        [userId]: !!isTeacher,
      });
    },
    [t, teacherRoleState],
  );

  const { mutate: mutateRemoveTeacher } = useMutation(removeTeacher, {
    onSuccess: onSuccessChangeTeacher,
  });

  const { mutate: mutateAppointTeacher } = useMutation(appointTeacher, {
    onSuccess: onSuccessChangeTeacher,
  });

  const handleTeacherRoleChange = useCallback(
    ({ isTeacher, userId }) =>
      async () => {
        setTeacherRoleState({
          ...teacherRoleState,
          [userId]: !isTeacher,
        });

        message.loading({ content: 'Loading...', key: messageKey });
        const mutateOptions = {
          onError: (error) =>
            onErrorChangeTeacher({ error, userId, isTeacher }),
        };
        if (isTeacher) {
          mutateRemoveTeacher(userId, mutateOptions);
        } else {
          mutateAppointTeacher(userId, mutateOptions);
        }
      },
    [
      teacherRoleState,
      mutateRemoveTeacher,
      onErrorChangeTeacher,
      mutateAppointTeacher,
    ],
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
        rowKey="id"
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
