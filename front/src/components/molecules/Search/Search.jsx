import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import SearchMobile from './Search.mobile';
import SearchDesktop from './Search.desktop';

const Search = (props) => {
  const isMobile = useContext(MobileContext);

  if (isMobile) {
    return <SearchMobile {...props} />;
  }

  return <SearchDesktop {...props} />;
};

export default Search;
