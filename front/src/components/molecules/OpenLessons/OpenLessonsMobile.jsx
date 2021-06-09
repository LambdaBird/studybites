import { useState } from 'react';
import { Row, Button } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';

import LessonsMain from './LessonsMain';

import * as S from './OpenLessonsMobile.styled';

const OpenLessonsMobile = () => {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  const showSearch = () => {
    setIsSearchVisible(true);
  };

  const hideSearch = () => {
    setIsSearchVisible(false);
  };

  return (
    <>
      <S.Header justify="space-between" align="middle">
        <S.Column>
          <Row justify="space-between" align="middle">
              <S.HeaderTitle level={3}>
                {t('user_home.open_lessons.title')}
              </S.HeaderTitle>
              <div>
                <S.ButtonFilter shape="circle" icon={<FilterOutlined />} size="large" />
                <Button shape="circle" icon={<SearchOutlined />} size="large" onClick={showSearch} />
              </div>
          </Row>
        </S.Column>
      </S.Header>
      <LessonsMain searchLessons={searchText} />
      {
        isSearchVisible 
          ?  (
            <S.ButtonClose type="button" onClick={hideSearch}>
              <S.CloseIcon />
            </S.ButtonClose>
          )
          : null
      }
      <S.SearchModal visible={isSearchVisible} bodyStyle={{ padding: 0 }} zIndex={900} footer={null} title={null} closable={false}>
        <DebouncedSearch
          style={{ height: 50 }}
          delay={500}
          placeholder={t('user_home.open_lessons.search')}
          allowClear
          onChange={onSearchChange}
        />
      </S.SearchModal>
    </>
  );
};

export default OpenLessonsMobile;
