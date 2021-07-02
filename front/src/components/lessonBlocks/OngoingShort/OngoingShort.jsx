import { useContext } from 'react';
import PropTypes from 'prop-types';

import MobileContext from '@sb-ui/contexts/MobileContext';

import OngoingShortMobile from './OngoingShort.mobile';
import OngoingShortDesktop from './OngoingShort.desktop';

const OngoingShort = ({ lesson }) => {
  const isMobile = useContext(MobileContext);

  if (isMobile) {
    return <OngoingShortMobile lesson={lesson} />;
  }

  return <OngoingShortDesktop lesson={lesson} />;
};

OngoingShort.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default OngoingShort;
