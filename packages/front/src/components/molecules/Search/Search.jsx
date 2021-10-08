import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import SearchDesktop from './Search.desktop';
import SearchMobile from './Search.mobile';

const Search = (props) => {
  const isMobile = useContext(MobileContext);

  if (isMobile) {
    return <SearchMobile {...props} />;
  }

  return <SearchDesktop {...props} />;
};

export default Search;
