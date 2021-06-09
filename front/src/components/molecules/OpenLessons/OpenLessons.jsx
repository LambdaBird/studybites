import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import OpenLessonsMobile from './OpenLessonsMobile';
import OpenLessonsDesktop from './OpenLessonsDesktop';

const OpenLessons = () => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {
        isMobile 
          ? <OpenLessonsMobile />
          : <OpenLessonsDesktop />
      }
    </>
  );
};

export default OpenLessons;
