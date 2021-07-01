import { useContext } from 'react';

import MobileContext from '@sb-ui/contexts/MobileContext';

import UserLessonMobile from './UserLesson.mobile';
import UserLessonDesktop from './UserLesson.desktop';

const UserLesson = (props) => {
  const isMobile = useContext(MobileContext);

  return (
    <>
      {isMobile ? (
        <UserLessonMobile {...props} />
      ) : (
        <UserLessonDesktop {...props} />
      )}
    </>
  );
};

export default UserLesson;
