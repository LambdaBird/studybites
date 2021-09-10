import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import PublicDesktop from './Public.desktop';
import PublicMobile from './Public.mobile';

const Public = (props) => {
  const isMobile = useContext(MobileContext);

  return (
    <>{isMobile ? <PublicMobile {...props} /> : <PublicDesktop {...props} />}</>
  );
};

export default Public;
