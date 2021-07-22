import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { LEARN_PAGE } from '@sb-ui/utils/paths';

export const useLesson = ({ id, maintainer }) => {
  const history = useHistory();

  const fullName = useMemo(
    () => `${maintainer?.[0]?.first_name} ${maintainer?.[0]?.last_name}`.trim(),
    [maintainer],
  );

  const firstNameLetter = useMemo(
    () => maintainer?.[0]?.first_name?.[0] || maintainer?.[0]?.last_name?.[0],
    [maintainer],
  );

  const handleContinueLesson = () => {
    history.push(LEARN_PAGE.replace(':id', id));
  };

  return { fullName, firstNameLetter, handleContinueLesson };
};
