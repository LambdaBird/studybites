import { Button, Col, Empty, Row, Space, Table, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { useTableSearch } from '@sb-ui/hooks/useTableSearch';
import { getTeacherLessonStudents } from '@sb-ui/utils/api/v1/teacher';
import { TEACHER_LESSON_STUDENTS_BASE_KEY } from '@sb-ui/utils/queries';

import * as S from './LessonStudents.styled';

const PAGE_SIZE = 10;

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
