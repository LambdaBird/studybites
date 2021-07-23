import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { LEARN_PAGE, USER_ENROLL } from '@sb-ui/utils/paths';

export const useLesson = ({ id, maintainers }) => {
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const history = useHistory();

  const fullName = useMemo(
    () => `${maintainers?.[0]?.firstName} ${maintainers?.[0]?.lastName}`.trim(),
    [maintainers],
  );

  const firstNameLetter = useMemo(
    () => maintainers?.[0]?.firstName?.[0] || maintainers?.[0]?.lastName?.[0],
    [maintainers],
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
