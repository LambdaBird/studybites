import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import PublicLessonMobile from './PublicLesson.mobile';
import PublicLessonDesktop from './PublicLesson.desktop';

const PublicLesson = (props) => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {isMobile ? (
        <PublicLessonMobile {...props} />
      ) : (
        <PublicLessonDesktop {...props} />
      )}
    </>
  );
};

export default PublicLesson;
