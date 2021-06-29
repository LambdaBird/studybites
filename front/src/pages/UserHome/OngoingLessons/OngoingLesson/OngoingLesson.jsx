import { useContext } from 'react';
import PropTypes from 'prop-types';

import MobileContext from '@sb-ui/contexts/MobileContext';

import OngoingLessonMobile from './OngoingLesson.mobile';
import OngoingLessonDesktop from './OngoingLesson.desktop';

const OngoingLesson = ({ lesson }) => {
  const isMobile = useContext(MobileContext);

  if (isMobile) {
    return <OngoingLessonMobile lesson={lesson} />;
  }

  return <OngoingLessonDesktop lesson={lesson} />;
};

OngoingLesson.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    maintainer: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default OngoingLesson;
