import { useContext } from 'react';
import { useQuery } from 'react-query';
import MobileContext from '@sb-ui/contexts/MobileContext';
import { USER_ENROLLED_SHORT_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { getEnrolledLessons } from '@sb-ui/utils/api/v1/student';
import OngoingLessonsMobile from './OngoingLessons.mobile';
import OngoingLessonsDesktop from './OngoingLessons.desktop';
import { PAGE_SHORT_SIZE } from './constants';

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

  if (!isLoading && !lessons?.length) return null;
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
