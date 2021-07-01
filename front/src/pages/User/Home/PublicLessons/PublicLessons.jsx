import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import PublicLessonsMobile from './PublicLessons.mobile';
import PublicLessonsDesktop from './PublicLessons.desktop';

const PublicLessons = (props) => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {isMobile ? (
        <PublicLessonsMobile {...props} />
      ) : (
        <PublicLessonsDesktop {...props} />
      )}
    </>
  );
};

export default PublicLessons;
