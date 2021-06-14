import { useContext } from 'react';
import PropTypes from 'prop-types';

import MobileContext from '@sb-ui/contexts/MobileContext';

import LessonsMainMobile from './LessonsMain.mobile';
import LessonsMainDesktop from './LessonsMain.desktop';

const LessonsMain = ({ searchLessons, isOngoingLesson }) => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {isMobile ? (
        <LessonsMainMobile
          isOngoingLesson={isOngoingLesson}
          searchLessons={searchLessons}
        />
      ) : (
        <LessonsMainDesktop
          isOngoingLesson={isOngoingLesson}
          searchLessons={searchLessons}
        />
      )}
    </>
  );
};

LessonsMain.defaultProps = {
  searchLessons: null,
  isOngoingLesson: false,
};

LessonsMain.propTypes = {
  isOngoingLesson: PropTypes.bool,
  searchLessons: PropTypes.string,
};

export default LessonsMain;
