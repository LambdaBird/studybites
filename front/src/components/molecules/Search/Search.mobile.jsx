import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';

import * as S from './Search.mobile.styled';

const SearchMobile = ({ setSearchText }) => {
  const { t } = useTranslation();

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
      <Button shape="circle" icon={<SearchOutlined />} size="large" onClick={showSearch} />
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
  )
};

SearchMobile.defaultProps = {
  setSearchText: () => {},
};

SearchMobile.propTypes = {
  setSearchText: PropTypes.func,
};

export default SearchMobile;
