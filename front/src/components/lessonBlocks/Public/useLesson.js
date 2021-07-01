import { useHistory, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { LESSON_PAGE, USER_ENROLL } from '@sb-ui/utils/paths';

export const useLesson = ({ id, firstName, lastName }) => {
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const history = useHistory();
  const author = useMemo(
    () => `${firstName} ${lastName}`,
    [firstName, lastName],
  );
  const handleEnroll = useCallback(() => {
    history.push({
      search: query,
      pathname: USER_ENROLL.replace(':id', id),
    });
  }, [history, id, query]);

  const handleContinueLesson = useCallback(() => {
    history.push(LESSON_PAGE.replace(':id', id));
  }, [history, id]);

  return { author, handleEnroll, handleContinueLesson };
};
