import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { LEARN_PAGE } from '@sb-ui/utils/paths';

export const useResource = ({ id, author }) => {
  const history = useHistory();

  const fullName = useMemo(
    () => `${author?.firstName} ${author?.lastName}`.trim(),
    [author],
  );

  const firstNameLetter = useMemo(
    () => author?.firstName?.[0] || author?.lastName?.[0],
    [author],
  );

  const handleContinueLesson = () => {
    history.push(LEARN_PAGE.replace(':id', id));
  };

  return { fullName, firstNameLetter, handleContinueLesson };
};
