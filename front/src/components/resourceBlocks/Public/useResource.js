import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  LEARN_COURSE_PAGE,
  LEARN_PAGE,
  USER_ENROLL_COURSE,
  USER_ENROLL_LESSON,
} from '@sb-ui/utils/paths';

export const useResource = ({ resource: { id, author }, isCourse = false }) => {
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const history = useHistory();

  const fullName = useMemo(
    () => `${author?.firstName} ${author?.lastName}`.trim(),
    [author],
  );

  const firstNameLetter = useMemo(
    () => author?.firstName?.[0] || author?.lastName?.[0],
    [author],
  );
  const handleEnroll = useCallback(() => {
    history.push({
      search: query,
      pathname: isCourse
        ? USER_ENROLL_COURSE.replace(':id', id)
        : USER_ENROLL_LESSON.replace(':id', id),
    });
  }, [history, id, isCourse, query]);

  const handleContinueLesson = useCallback(() => {
    return isCourse
      ? history.push(LEARN_COURSE_PAGE.replace(':id', id))
      : history.push(LEARN_PAGE.replace(':id', id));
  }, [history, id, isCourse]);

  return { fullName, firstNameLetter, handleEnroll, handleContinueLesson };
};
