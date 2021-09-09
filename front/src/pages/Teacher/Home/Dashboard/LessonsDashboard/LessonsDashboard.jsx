import { message, Row, Select, Skeleton, Space } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { getTeacherLessons } from '@sb-ui/utils/api/v1/teacher';
import { LESSONS_NEW } from '@sb-ui/utils/paths';
import { TEACHER_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { skeletonArray } from '@sb-ui/utils/utils';

import { pageLimit, statusesOptions } from '../constants';
import LessonsList from '../LessonsList';

import * as S from '../Dashboard.styled';

const { Option } = Select;

const LessonsDashboard = () => {
  const { t } = useTranslation('teacher');
  const history = useHistory();

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: responseData, isLoading } = useQuery(
    [
      TEACHER_LESSONS_BASE_KEY,
      {
        offset: (currentPage - 1) * pageLimit,
        limit: pageLimit,
        search,
        status: selectedStatus,
      },
    ],
    getTeacherLessons,
    {
      keepPreviousData: true,
      onError: () => {
        message.error({
          content: t('lesson_dashboard.error'),
          duration: 2,
        });
      },
    },
  );

  const { lessons, total } = responseData || {};

  const handleCreateLesson = () => {
    history.push(LESSONS_NEW);
  };

  return (
    <Row gutter={[32, 32]}>
      <S.DashboardControls>
        <Space size="middle">
          <S.DashboardTitle>{t('lesson_dashboard.title')}</S.DashboardTitle>
          <DebouncedSearch
            delay={500}
            placeholder={t('lesson_dashboard.search.placeholder')}
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
        <S.AddButton icon={<PlusOutlined />} onClick={handleCreateLesson}>
          {t('lesson_dashboard.add_button')}
        </S.AddButton>
      </S.DashboardControls>
      {isLoading ? (
        skeletonArray(pageLimit).map((el) => (
          <S.CardCol key={el.id}>
            <Skeleton loading active avatar paragraph={{ rows: 2 }} />
          </S.CardCol>
        ))
      ) : (
        <LessonsList
          lessons={lessons}
          onCreateLesson={handleCreateLesson}
          isAddNewShown={!total && !search && !selectedStatus}
        />
      )}
      {!isLoading && total > pageLimit ? (
        <S.PaginationWrapper>
          <S.DashboardPagination
            current={currentPage}
            total={total}
            pageSize={pageLimit}
            onChange={setCurrentPage}
          />
        </S.PaginationWrapper>
      ) : null}
    </Row>
  );
};

export default LessonsDashboard;
