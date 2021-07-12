import { Popover } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@ant-design/icons';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';

import * as S from './Search.mobile.styled';

const SearchMobile = ({ setSearchText, searchText, className, placement }) => {
  const { t } = useTranslation('user');

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  return (
    <>
      <Popover
        placement={placement}
        content={
          <DebouncedSearch
            className={className}
            delay={500}
            placeholder={t('home.open_lessons.search')}
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
  placement: 'topRight',
};

SearchMobile.propTypes = {
  setSearchText: PropTypes.func,
  className: PropTypes.string,
  searchText: PropTypes.string,
  placement: PropTypes.string,
};

export default SearchMobile;
