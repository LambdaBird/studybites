import { useContext } from 'react';
import PropTypes from 'prop-types';

import MobileContext from '@sb-ui/contexts/MobileContext';

import LessonsMainMobile from './LessonsMainMobile';
import LessonsMainDesktop from './LessonsMainDesktop';

const LessonsMain = ({ searchLessons }) => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {
        isMobile 
          ? <LessonsMainMobile searchLessons={searchLessons} />
          : <LessonsMainDesktop searchLessons={searchLessons} />
      }
    </>
  );
};

LessonsMain.defaultProps = {
  searchLessons: null,
};

LessonsMain.propTypes = {
  searchLessons: PropTypes.string,
};


export default LessonsMain;
