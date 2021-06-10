import { useContext } from 'react';
import PropTypes from 'prop-types';

import MobileContext from '@sb-ui/contexts/MobileContext';

import CurrentLessonMobile from './CurrentLesson.mobile';
import CurrentLessonDesktop from './CurrentLesson.desktop';

const CurrentLesson = ({ lesson }) => {
  const isMobile = useContext(MobileContext);

  if (isMobile) {
    return <CurrentLessonMobile lesson={lesson} />
  }

  return <CurrentLessonDesktop lesson={lesson} />
};

CurrentLesson.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    maintainer: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default CurrentLesson;
