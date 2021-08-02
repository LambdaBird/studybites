import { Button, Col, Empty, Row, Space, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { getTeacherLessonStudents } from '@sb-ui/utils/api/v1/teacher';
import { TEACHER_LESSON_STUDENTS_BASE_KEY } from '@sb-ui/utils/queries';
import { getQueryPage } from '@sb-ui/utils/utils';

import * as S from './LessonStudents.styled';

const PAGE_SIZE = 10;

const LessonStudents = () => {
  const { t } = useTranslation('teacher');
  const { id: lessonId } = useParams();
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
      TEACHER_LESSON_STUDENTS_BASE_KEY,
      {
        lessonId,
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search,
      },
    ],
    getTeacherLessonStudents,
    { keepPreviousData: true },
  );

  const { students, total } = responseData || {};

  useEffect(() => {
    if (students?.length === 0 && total !== 0) {
      setCurrentPage(1);
      history.replace({
        search: ``,
      });
    }
  }, [students, history, total]);

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

  const columns = useMemo(
    () => [
      {
        title: t('lesson_students.table.full_name'),
        dataIndex: 'fullName',
        key: 'fullName',
        width: '35%',
      },
      {
        title: t('lesson_students.table.email'),
        dataIndex: 'email',
        key: 'email',
        width: '35%',
      },
      {
        title: t('lesson_students.table.lastActivity'),
        dataIndex: 'lastActivity',
        key: 'lastActivity',
        width: '20%',
      },
      {
        title: t('lesson_students.table.action'),
        key: 'action',
        render: () => (
          <Space size="middle">
            <Typography.Link>
              {t('lesson_students.table.action_remove')}
            </Typography.Link>
          </Space>
        ),
        width: '10%',
      },
    ],
    [t],
  );

  return (
    <S.Page>
      <S.TableHeader>
        <Col>
          <Row>
            <Space size="large">
              <S.TitleHeader>
                {t('lesson_students.title', { studentsCount: total })}
              </S.TitleHeader>
              <DebouncedSearch
                delay={500}
                placeholder={t('lesson_students.search.placeholder')}
                allowClear
                onChange={setSearch}
              />
            </Space>
          </Row>
        </Col>
        <Col>
          <Button disabled>
            {t('lesson_students.buttons.invite_student')}
          </Button>
        </Col>
      </S.TableHeader>
      <Table
        columns={columns}
        dataSource={students}
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
              description={t('lesson_students.table.no_data')}
            />
          ),
        }}
      />
    </S.Page>
  );
};

export default LessonStudents;
