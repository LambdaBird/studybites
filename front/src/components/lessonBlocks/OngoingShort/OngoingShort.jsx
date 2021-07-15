import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import OngoingShortDesktop from './OngoingShort.desktop';
import OngoingShortMobile from './OngoingShort.mobile';

const OngoingShort = (props) => {
  const isMobile = useContext(MobileContext);

  if (isMobile) {
    return <OngoingShortMobile {...props} />;
  }

  return <OngoingShortDesktop {...props} />;
};

export default OngoingShort;
