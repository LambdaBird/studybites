import { useContext } from 'react';
import PropTypes from 'prop-types';

import MobileContext from '@sb-ui/contexts/MobileContext';

import PublicLessonMobile from './PublicLesson.mobile';
import PublicLessonDesktop from './PublicLesson.desktop';

const PublicLesson = ({ getLessons, lesson }) => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {
        isMobile 
          ? <PublicLessonMobile getLessons={getLessons} lesson={lesson} />
          : <PublicLessonDesktop getLessons={getLessons} lesson={lesson} />
      }
    </>
  );
};

PublicLesson.propTypes = {
  getLessons: PropTypes.func.isRequired,
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PublicLesson;
