import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';
import * as S from './Search.desktop.styled';

const SearchDesktop = ({ setSearchText, className = '' }) => {
  const { t } = useTranslation('user');

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  return (
    <S.Wrapper>
      <DebouncedSearch
        delay={500}
        placeholder={t('home.open_lessons.search')}
        allowClear
        onChange={onSearchChange}
        className={className}
      />
    </S.Wrapper>
  );
};

SearchDesktop.defaultProps = {
  setSearchText: () => {},
};

SearchDesktop.propTypes = {
  setSearchText: PropTypes.func,
  className: PropTypes.string,
};

export default SearchDesktop;
