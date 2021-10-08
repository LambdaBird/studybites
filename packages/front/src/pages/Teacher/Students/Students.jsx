import { Button, Col, Empty, Row, Space, Table } from 'antd';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { useTableSearch } from '@sb-ui/hooks/useTableSearch';
import { getLanguageCodeByKey } from '@sb-ui/i18n';
import { getTeacherStudents } from '@sb-ui/utils/api/v1/teacher';
import { sbPostfix } from '@sb-ui/utils/constants';
import { TEACHER_STUDENTS_BASE_KEY } from '@sb-ui/utils/queries';
import { formatDate } from '@sb-ui/utils/utils';

import LessonsTags from './LessonsTags';
import * as S from './Students.styled';

const PAGE_SIZE = 10;

const Students = () => {
  const { id: lessonId } = useParams();
  const { t, i18n } = useTranslation('teacher');

  const languageCode = useMemo(
    () => getLanguageCodeByKey(i18n.language),
    [i18n.language],
  );

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
    baseKey: TEACHER_STUDENTS_BASE_KEY,
    getFunc: getTeacherStudents,
    pageSize: PAGE_SIZE,
    params: {
      lessonId,
    },
  });

  const columns = useMemo(
    () => [
      {
        title: t('students.table.full_name'),
        dataIndex: 'fullName',
        key: 'fullName',
        width: '35%',
      },
      {
        title: t('students.table.email'),
        dataIndex: 'email',
        key: 'email',
        width: '35%',
      },
      {
        title: t('students.table.last_activity'),
        dataIndex: 'lastActivity',
        key: 'lastActivity',
        render: (lastActivity) =>
          formatDate(lastActivity, languageCode) ||
          t('lesson_students.table.not_started'),
        width: '20%',
      },
      {
        title: t('students.table.lessons'),
        key: 'lessons',
        render: LessonsTags,
        width: '10%',
      },
    ],
    [languageCode, t],
  );

  return (
    <>
      <Helmet>
        <title>
          {t('pages.students')}
          {sbPostfix}
        </title>
      </Helmet>
      <S.Page>
        <S.TableHeader>
          <Col>
            <Row>
              <Space size="large">
                <S.TitleHeader>
                  {t('students.title', { studentsCount: total })}
                </S.TitleHeader>
                <DebouncedSearch
                  delay={500}
                  placeholder={t('students.search.placeholder')}
                  allowClear
                  onChange={setSearch}
                />
              </Space>
            </Row>
          </Col>
          <Col>
            <Button disabled>{t('students.buttons.invite_student')}</Button>
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
                description={t('students.table.no_data')}
              />
            ),
          }}
        />
      </S.Page>
    </>
  );
};

export default Students;
