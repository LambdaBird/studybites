import { Button, message, Row, Select, Skeleton, Space } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { PlusOutlined } from '@sb-ui/components/Icons';
import { getTeacherCourses } from '@sb-ui/utils/api/v1/courses-management';
import { COURSES_NEW } from '@sb-ui/utils/paths';
import { TEACHER_COURSES_BASE_KEY } from '@sb-ui/utils/queries';
import { skeletonArray } from '@sb-ui/utils/utils';

import { pageLimit, statusesOptions } from '../constants';
import LessonsList from '../LessonsList';

import * as S from '../Dashboard.styled';

const { Option } = Select;

const CoursesDashboard = () => {
  const { t } = useTranslation('teacher');
  const history = useHistory();

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: responseData, isLoading } = useQuery(
    [
      TEACHER_COURSES_BASE_KEY,
      {
        offset: (currentPage - 1) * pageLimit,
        limit: pageLimit,
        search,
        status: selectedStatus,
      },
    ],
    getTeacherCourses,
    {
      keepPreviousData: true,
      onError: () => {
        message.error({
          content: t('course_dashboard.error'),
          duration: 2,
        });
      },
    },
  );

  const { courses, total } = responseData || {};

  const handleCreateCourse = () => {
    history.push(COURSES_NEW);
  };

  const isAddNewShown = useMemo(
    () => !total && !search && !selectedStatus,
    [search, selectedStatus, total],
  );

  const isPaginationShown = useMemo(
    () => !isLoading && total > pageLimit,
    [isLoading, total],
  );

  return (
    <Row gutter={[32, 32]}>
      <S.DashboardControls>
        <Space size="middle">
          <S.DashboardTitle>{t('course_dashboard.title')}</S.DashboardTitle>
          <DebouncedSearch
            delay={500}
            placeholder={t('course_dashboard.search.placeholder')}
            allowClear
            onChange={setSearch}
          />
          <S.StyledSelect value={selectedStatus} onChange={setSelectedStatus}>
            {statusesOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </Option>
            ))}
          </S.StyledSelect>
        </Space>
        <Button
          icon={<PlusOutlined />}
          type="link"
          onClick={handleCreateCourse}
        >
          {t('course_dashboard.add_button')}
        </Button>
      </S.DashboardControls>
      {isLoading ? (
        skeletonArray(pageLimit).map((el) => (
          <S.CardCol key={el.id}>
            <Skeleton loading active avatar paragraph={{ rows: 2 }} />
          </S.CardCol>
        ))
      ) : (
        <LessonsList
          isCourse
          lessons={courses}
          onCreateLesson={handleCreateCourse}
          isAddNewShown={isAddNewShown}
        />
      )}
      {isPaginationShown && (
        <S.PaginationWrapper>
          <S.DashboardPagination
            current={currentPage}
            total={total}
            pageSize={pageLimit}
            onChange={setCurrentPage}
          />
        </S.PaginationWrapper>
      )}
    </Row>
  );
};

export default CoursesDashboard;
