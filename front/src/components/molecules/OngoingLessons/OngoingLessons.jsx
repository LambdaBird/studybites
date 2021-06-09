import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import OngoingLessonsMobile from './OngoingLessonsMobile';
import OngoingLessonsDesktop from './OngoingLessonsDesktop';

const OngoingLessons = () => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {
        isMobile 
          ? <OngoingLessonsMobile />
          : <OngoingLessonsDesktop />
      }
    </>
  );
};

export default OngoingLessons;
