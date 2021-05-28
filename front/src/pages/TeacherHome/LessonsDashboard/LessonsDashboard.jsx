import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select, Space, Typography, Input, Button, Skeleton } from 'antd';
import LessonCard from './LessonCard';
import AddCard from './AddCard';
import * as S from './LessonsDashboard.styled';
import addButtonIcon from '../../../resources/img/add_button.svg'

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const itemPerGage = [...new Array(8)];

const LessonsDashboard = ({ lessons, loading }) => {
  const { t } = useTranslation();
  // eslint-disable-next-line
  console.log(lessons, loading);
  return (
    <S.Wrapper gutter={[0, 32]} justify="center" align="center">
      <S.DashboardControls justify="space-between">
        <Space size="middle">
          <Title level={4}>{t('lesson_dashboard.title')}</Title>
          <Search placeholder={t('lesson_dashboard.search.placeholder')} onSearch={() => {}} style={{ width: 195 }} />
          <Select defaultValue={t('lesson_dashboard.select.status')} style={{ width: 98 }} onChange={() => {}}>
            <Option value='draft'>{t('lesson_dashboard.select.draft')}</Option>
            <Option value='archived'>{t('lesson_dashboard.select.archived')}</Option>
            <Option value='public'>{t('lesson_dashboard.select.public')}</Option>
            <Option value='private'>{t('lesson_dashboard.select.private')}</Option>
          </Select>
        </Space>
        <Button type="link" icon={<S.IconImage preview={false} src={addButtonIcon}/>}>{t('lesson_dashboard.add_button')}</Button>
      </S.DashboardControls>
      <S.DashboardLessons gutter={[32, 32]}>
        {lessons ? lessons.map((item) => (
            <S.CardCol span={12}>
              <LessonCard
                key={item.id}
                cover={item.cover}
                title={item.name}
              />
            </S.CardCol>
          )) : itemPerGage.map(() => (
            <S.CardCol span={12}>
              <Skeleton loading={loading} active avatar paragraph={{ rows: 4 }} />
            </S.CardCol>
          ))
        }
        {(lessons && lessons.length) < itemPerGage ? (
            <S.CardCol span={12}>
              <AddCard />
            </S.CardCol>
          ) : null
        }
      </S.DashboardLessons>
    </S.Wrapper>
  );
};

LessonsDashboard.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.shape({
    cover: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  })),
  loading: PropTypes.bool,
};

LessonsDashboard.defaultProps = {
  lessons: [],
  loading: true,
};

export default LessonsDashboard;