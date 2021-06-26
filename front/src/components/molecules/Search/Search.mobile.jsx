import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Popover } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import * as S from './Search.mobile.styled';

const SearchMobile = ({ setSearchText, searchText, className }) => {
  const { t } = useTranslation();

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  return (
    <>
      <Popover
        placement="topRight"
        content={
          <DebouncedSearch
            className={className}
            delay={500}
            placeholder={t('user_home.open_lessons.search')}
            allowClear
            onChange={onSearchChange}
            size="large"
          />
        }
        trigger="click"
      >
        <S.StyledSearchButton
          shape="circle"
          icon={<SearchOutlined />}
          size="large"
          $isActive={!!searchText}
        />
      </Popover>
    </>
  );
};

SearchMobile.defaultProps = {
  setSearchText: () => {},
  searchText: '',
};

SearchMobile.propTypes = {
  setSearchText: PropTypes.func,
  className: PropTypes.string,
  searchText: PropTypes.string,
};

export default SearchMobile;
