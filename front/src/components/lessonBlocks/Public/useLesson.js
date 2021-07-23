import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { LEARN_PAGE, USER_ENROLL } from '@sb-ui/utils/paths';

export const useLesson = ({ id, author }) => {
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
      pathname: USER_ENROLL.replace(':id', id),
    });
  }, [history, id, query]);

  const handleContinueLesson = useCallback(() => {
    history.push(LEARN_PAGE.replace(':id', id));
  }, [history, id]);

  return { fullName, firstNameLetter, handleEnroll, handleContinueLesson };
};
