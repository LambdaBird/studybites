import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select, Space, Typography, Input, Button } from 'antd';
import LessonCard from './LessonCard';
import AddCard from './AddCard';
import * as S from './LessonsDashboard.styled';
import addButtonIcon from '../../../resources/img/add_button.svg'

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const LessonsDashboard = ({ lessons }) => {
  const { t } = useTranslation();
  // eslint-disable-next-line
  console.log(lessons);
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
      <S.DashboardLessons gutter={[32, 32]} justify="flex-start" align="top">
        <S.CardCol span={12}>
          <LessonCard
            cover="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            title="New lesson"
          />
        </S.CardCol>
        <S.CardCol span={12}>
          <AddCard />
        </S.CardCol>
      </S.DashboardLessons>
    </S.Wrapper>
  );
};

LessonsDashboard.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.shape({
    avatar: PropTypes.string.isRequired,
  })),
};

LessonsDashboard.defaultProps = {
  lessons: [],
};

export default LessonsDashboard;