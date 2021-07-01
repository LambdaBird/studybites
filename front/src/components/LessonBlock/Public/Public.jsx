import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import PublicMobile from './Public.mobile';
import PublicDesktop from './Public.desktop';

const Public = (props) => {
  const isMobile = useContext(MobileContext);

  return (
    <>{isMobile ? <PublicMobile {...props} /> : <PublicDesktop {...props} />}</>
  );
};

export default Public;
