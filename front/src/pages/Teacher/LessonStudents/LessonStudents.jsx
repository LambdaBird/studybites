import { Button, Col, Empty, Row, Space, Table } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { useTableSearch } from '@sb-ui/hooks/useTableSearch';
import {
  getLesson,
  getTeacherLessonStudents,
} from '@sb-ui/utils/api/v1/teacher';
import {
  TEACHER_LESSON_BASE_KEY,
  TEACHER_LESSON_STUDENTS_BASE_KEY,
} from '@sb-ui/utils/queries';
import { formatDate } from '@sb-ui/utils/utils';

import FunnelContainer from './FunnelContainer';
import * as S from './LessonStudents.styled';

const PAGE_SIZE = 10;
// TODO: take from shared place
// eslint-disable-next-line no-unused-vars
const interactiveTypesBlocks = ['next', 'next', 'closedQuestion', 'quiz'];

const LessonStudents = () => {
  const { id: lessonId } = useParams();
  const { t } = useTranslation('teacher');

  const {
    setSearch,
    data: students,
    total,
    onChangeLessonsPage,
    isLoading,
    isPreviousData,
    currentPage,
  } = useTableSearch({
    dataKey: 'students',
    baseKey: TEACHER_LESSON_STUDENTS_BASE_KEY,
    getFunc: getTeacherLessonStudents,
    pageSize: PAGE_SIZE,
    params: {
      lessonId,
    },
  });

  const { data: lessonData, isLoading: isLessonLoading } = useQuery(
    [TEACHER_LESSON_BASE_KEY, { id: lessonId }],
    getLesson,
    {
      keepPreviousData: true,
    },
  );

  const interactiveBlocksNumber = useMemo(
    () =>
      lessonData?.lesson?.blocks.filter((block) =>
        interactiveTypesBlocks.includes(block.type),
      )?.length || 0,
    [lessonData],
  );

  const columns = useMemo(
    () => [
      {
        title: t('lesson_students.table.full_name'),
        dataIndex: 'fullName',
        key: 'fullName',
        width: '30%',
      },
      {
        title: t('lesson_students.table.email'),
        dataIndex: 'email',
        key: 'email',
        width: '20%',
      },
      {
        title: t('lesson_students.table.last_activity'),
        dataIndex: 'results',
        key: 'results',
        render: (results) => {
          const lastActivity = results?.slice(-1)?.[0]?.createdAt;
          return (
            formatDate(lastActivity) || t('lesson_students.table.not_started')
          );
        },
        width: '20%',
      },
      {
        title: t('lesson_students.table.first_activity'),
        dataIndex: 'results',
        key: 'start',
        render: (results) => {
          const firstActivity = results?.[0]?.createdAt;
          return (
            formatDate(firstActivity) || t('lesson_students.table.not_started')
          );
        },
        width: '20%',
      },
      {
        title: t('lesson_students.table.progress'),
        dataIndex: 'results',
        key: 'progress',
        render: (results) => {
          // eslint-disable-next-line react/destructuring-assignment
          const progress = results.filter(
            (result) => result.action !== 'start',
          )?.length;

          return (
            <Space size="middle">
              {progress} / {interactiveBlocksNumber}
            </Space>
          );
        },
        width: '10%',
      },
    ],
    [t, interactiveBlocksNumber],
  );

  return (
    <S.Page>
      <FunnelContainer lessonId={lessonId} />
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
          !(isLoading || isLessonLoading) &&
          total > PAGE_SIZE && {
            showSizeChanger: false,
            current: currentPage,
            pageSize: PAGE_SIZE,
            total,
          }
        }
        onChange={onChangeLessonsPage}
        loading={isLoading || isPreviousData || isLessonLoading}
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
