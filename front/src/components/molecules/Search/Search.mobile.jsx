import { useTranslation } from 'react-i18next';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import { SearchOutlined } from '@sb-ui/components/Icons';

import { SearchPropTypes } from './types';
import * as S from './Search.mobile.styled';

const SearchMobile = ({
  setSearchText,
  searchText,
  className,
  placement,
  marginRight,
}) => {
  const { t } = useTranslation('user');

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  return (
    <>
      <S.Popover
        marginRight={marginRight}
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
      >
        <S.StyledSearchButton
          shape="circle"
          icon={<SearchOutlined />}
          size="large"
          $isActive={!!searchText}
        />
      </S.Popover>
    </>
  );
};

SearchMobile.defaultProps = {
  setSearchText: () => {},
  searchText: '',
  placement: 'topRight',
};

SearchMobile.propTypes = SearchPropTypes;

export default SearchMobile;
