import { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Row, Select, Space, Button, Skeleton, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { getTeacherLessons } from '@sb-ui/utils/api/v1/lesson';
import { LESSON_EDIT } from '@sb-ui/utils/paths';
import * as S from './LessonsDashboard.styled';
import LessonsList from './LessonsList';
import {
  itemPerPage,
  pageLimit,
  TEACHER_LESSONS_BASE_KEY,
  statusesOptions,
} from './constants';

const { Option } = Select;

const LessonsDashboard = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery(
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
    { keepPreviousData: true },
  );

  const { data, total } = responseData || {};

  const handleCreateLesson = () => {
    history.push(LESSON_EDIT);
  };

  return (
    <Row gutter={[32, 32]}>
      <S.DashboardControls justify="space-between" align="middle">
        <Space size="middle">
          <S.DashboardTitle level={4}>
            {t('lesson_dashboard.title')}
          </S.DashboardTitle>
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
        <Button
          icon={<PlusOutlined />}
          type="link"
          onClick={handleCreateLesson}
        >
          {t('lesson_dashboard.add_button')}
        </Button>
      </S.DashboardControls>
      {isError && (
        <Alert message="Can not fetch lessons" type="error" showIcon />
      )}

      {isLoading ? (
        itemPerPage.map((el) => (
          <S.CardCol key={el.id} span={12}>
            <Skeleton loading active avatar paragraph={{ rows: 2 }} />
          </S.CardCol>
        ))
      ) : (
        <LessonsList
          lessons={data}
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
            showSizeChanger={false}
            size="small"
          />
        </S.PaginationWrapper>
      ) : null}
    </Row>
  );
};

export default LessonsDashboard;
