import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import OngoingLessonsMobile from './OngoingLessons.mobile';
import OngoingLessonsDesktop from './OngoingLessons.desktop';

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
