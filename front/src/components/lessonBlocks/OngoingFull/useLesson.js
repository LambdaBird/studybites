import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { LEARN_PAGE } from '@sb-ui/utils/paths';

export const useLesson = ({ id, maintainers }) => {
  const history = useHistory();

  const fullName = useMemo(
    () => `${maintainers?.[0]?.firstName} ${maintainers?.[0]?.lastName}`.trim(),
    [maintainers],
  );

  const firstNameLetter = useMemo(
    () => maintainers?.[0]?.firstName?.[0] || maintainers?.[0]?.lastName?.[0],
    [maintainers],
  );

  const handleContinueLesson = () => {
    history.push(LEARN_PAGE.replace(':id', id));
  };

  return { fullName, firstNameLetter, handleContinueLesson };
};
