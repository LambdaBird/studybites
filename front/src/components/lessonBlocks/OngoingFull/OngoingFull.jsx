import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import OngoingFullMobile from './OngoingFull.mobile';
import OngoingFullDesktop from './OngoingFull.desktop';

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
