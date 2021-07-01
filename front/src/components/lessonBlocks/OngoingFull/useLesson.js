import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';
import { LESSON_PAGE } from '@sb-ui/utils/paths';

export const useLesson = ({ id, maintainer }) => {
  const history = useHistory();

  const fullName = useMemo(
    () =>
      `${maintainer.userInfo.firstName} ${maintainer.userInfo.lastName}`.trim(),
    [maintainer.userInfo.firstName, maintainer.userInfo.lastName],
  );

  const firstNameLetter = useMemo(
    () => maintainer.userInfo.firstName[0] || maintainer.userInfo.lastName[0],
    [maintainer.userInfo.firstName, maintainer.userInfo.lastName],
  );

  const handleContinueLesson = () => {
    history.push(LESSON_PAGE.replace(':id', id));
  };

  return { fullName, firstNameLetter, handleContinueLesson };
};
