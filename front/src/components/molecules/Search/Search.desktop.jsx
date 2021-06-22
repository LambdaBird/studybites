import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';

const SearchDesktop = ({ setSearchText, className = '' }) => {
  const { t } = useTranslation();

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  return (
    <DebouncedSearch
      delay={500}
      placeholder={t('user_home.open_lessons.search')}
      allowClear
      onChange={onSearchChange}
      size="large"
      className={className}
    />
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
