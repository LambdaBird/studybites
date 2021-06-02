import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Row, Select, Space, Input, Button, Skeleton, Image } from 'antd';
import useDebounce from '../../../hooks/useDebounce';
import LessonCard from './LessonCard';
import AddCard from './AddCard';
import * as S from './LessonsDashboard.styled';
import addButtonIcon from '../../../resources/img/add_button.svg';
import searchIcon from '../../../resources/img/search.svg';

const { Option } = Select;

const searchDelay = 500;
const pageLimit = 8;
const itemPerPage = [...new Array(pageLimit)].map((el, index) => ({
  id: `skeleton ${index}`,
}));

const LessonsDashboard = ({
  lessons,
  loading,
  pagination,
  actions: { changePage, filter, search },
}) => {
  const [searchReq, setSearchReq] = useState(null);
  const debouncedSearch = useDebounce(searchReq, searchDelay);

  useEffect(() => {
    if (debouncedSearch !== null) {
      search(debouncedSearch);
    }
  }, [debouncedSearch, search]);

  const { t } = useTranslation();

  const handleSearchChange = ({ target: { value } }) => {
    setSearchReq(value);
  };

  const handlePaginationChange = (page) => {
    changePage(page);
  };

  const handleFilterChange = (value) => {
    filter(value);
  };

  return (
    <Row gutter={[32, 32]} style={{ paddingTop: "3rem" }}>
      <S.DashboardControls justify="space-between" align="middle">
        <Space size="middle">
          <S.DashboardTitle level={4}>
            {t('lesson_dashboard.title')}
          </S.DashboardTitle>
          <Input
            placeholder={t('lesson_dashboard.search.placeholder')}
            suffix={<Image preview={false} src={searchIcon} />}
            onChange={handleSearchChange}
            style={{ width: 195 }}
          />
          <Select
            defaultValue={t('lesson_dashboard.select.all')}
            style={{ width: 120 }}
            onChange={handleFilterChange}
          >
            <Option value={null}>{t('lesson_dashboard.select.all')}</Option>
            <Option value="Draft">{t('lesson_dashboard.select.draft')}</Option>
            <Option value="Archived">
              {t('lesson_dashboard.select.archived')}
            </Option>
            <Option value="Public">
              {t('lesson_dashboard.select.public')}
            </Option>
            <Option value="Private">
              {t('lesson_dashboard.select.private')}
            </Option>
          </Select>
        </Space>
        <Button
          type="link"
          icon={<S.IconImage preview={false} src={addButtonIcon} />}
          onClick={() => {}}
        >
          {t('lesson_dashboard.add_button')}
        </Button>
      </S.DashboardControls>
        {lessons
          ? <>
              {lessons.map((item, index) => (
                <S.CardCol key={item.id} span={12}>
                  <LessonCard
                    cover={lessons[index].cover}
                    title={lessons[index].name}
                    students={lessons[index].students}
                    status={lessons[index].status}
                  />
                </S.CardCol>))}
              {lessons.length < itemPerPage.length
                ? <>
                    <S.CardCol span={12}>
                      <AddCard onClick={() => {}} />
                    </S.CardCol>
                    {itemPerPage.slice(0, lessons.length).map((el) => (
                      <S.CardCol key={el.id} span={12} />
                      ))}
                  </>
                : null}
            </>
          : itemPerPage.map((el) => (
              <S.CardCol key={el.id} span={12}>
                <Skeleton
                  loading={loading}
                  active
                  avatar
                  paragraph={{ rows: 2 }}
                />
              </S.CardCol>
            ))}
      {!loading ? (
        <S.PaginationWrapper>
          <S.DashboardPagination
            current={pagination.currentPage}
            total={pagination.totalPage}
            pageSize={pagination.pageLimit}
            onChange={handlePaginationChange}
            showSizeChanger={false}
            size="small"
          />
        </S.PaginationWrapper>
      ) : null}
    </Row>
  );
};

LessonsDashboard.propTypes = {
  lessons: PropTypes.arrayOf(
    PropTypes.shape({
      cover: PropTypes.string,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      students: PropTypes.arrayOf(
        PropTypes.shape({
          avatar: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
  loading: PropTypes.bool,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPage: PropTypes.number,
    pageLimit: PropTypes.number,
    isPagination: PropTypes.bool,
  }),
  actions: PropTypes.shape({
    changePage: PropTypes.func.isRequired,
    filter: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
  }).isRequired,
};

LessonsDashboard.defaultProps = {
  lessons: [],
  loading: true,
  pagination: {},
};

export default LessonsDashboard;
