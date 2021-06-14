import { useContext } from 'react';
import PropTypes from 'prop-types';

import MobileContext from '@sb-ui/contexts/MobileContext';

import SearchMobile from './Search.mobile';
import SearchDesktop from './Search.desktop';

const Search = ({ setSearchText }) => {
  const isMobile = useContext(MobileContext);

  if (isMobile) {
    return <SearchMobile setSearchText={setSearchText} />
  }

  return <SearchDesktop setSearchText={setSearchText} />
};

Search.defaultProps = {
  setSearchText: () => {},
};

Search.propTypes = {
  setSearchText: PropTypes.func,
};

export default Search;
