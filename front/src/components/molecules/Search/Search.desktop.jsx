import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';

const SearchDesktop = ({ setSearchText }) => {
  const { t } = useTranslation();

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  return (
    <DebouncedSearch
      delay={500}
      placeholder={t('user_home.open_lessons.search')}
      allowClear
      style={{ width: 200, marginLeft: '1rem' }}
      onChange={onSearchChange}
    />
  )
};

SearchDesktop.defaultProps = {
  setSearchText: () => {},
};

SearchDesktop.propTypes = {
  setSearchText: PropTypes.func,
};

export default SearchDesktop;
