import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import OngoingFullDesktop from './OngoingFull.desktop';
import OngoingFullMobile from './OngoingFull.mobile';

const OngoingFull = (props) => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {isMobile ? (
        <OngoingFullMobile {...props} />
      ) : (
        <OngoingFullDesktop {...props} />
      )}
    </>
  );
};

export default OngoingFull;
