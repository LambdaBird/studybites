import { useContext } from 'react';
import { useQuery } from 'react-query';

import MobileContext from '@sb-ui/contexts/MobileContext';
import { getEnrolledLessons } from '@sb-ui/utils/api/v1/student';
import { USER_ENROLLED_SHORT_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';

import { PAGE_SHORT_SIZE } from './constants';
import OngoingLessonsDesktop from './OngoingLessons.desktop';
import OngoingLessonsMobile from './OngoingLessons.mobile';

const OngoingLessons = () => {
  const isMobile = useContext(MobileContext);
  const { isLoading, data: responseData } = useQuery(
    [
      USER_ENROLLED_SHORT_LESSONS_BASE_KEY,
      {
        limit: PAGE_SHORT_SIZE,
      },
    ],
    getEnrolledLessons,
    { keepPreviousData: true },
  );
  const { lessons } = responseData || {};

  if (!lessons?.length) return null;
  return (
    <>
      {isMobile ? (
        <OngoingLessonsMobile isLoading={isLoading} lessons={lessons} />
      ) : (
        <OngoingLessonsDesktop isLoading={isLoading} lessons={lessons} />
      )}
    </>
  );
};

export default OngoingLessons;
