import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import {
  COURSES_RESOURCE_KEY,
  LESSONS_RESOURCE_KEY,
} from '@sb-ui/pages/User/constants';
import { LEARN_COURSE_PAGE, LEARN_PAGE } from '@sb-ui/utils/paths';

export const useResource = ({ id, author, resourceKey }) => {
  const history = useHistory();

  const fullName = useMemo(
    () => `${author?.firstName} ${author?.lastName}`.trim(),
    [author],
  );

  const firstNameLetter = useMemo(
    () => author?.firstName?.[0] || author?.lastName?.[0],
    [author],
  );

  const handleContinueResource = () => {
    switch (resourceKey) {
      case LESSONS_RESOURCE_KEY:
        history.push(LEARN_PAGE.replace(':id', id));
        break;
      case COURSES_RESOURCE_KEY:
        history.push(LEARN_COURSE_PAGE.replace(':id', id));
        break;
      default:
        break;
    }
  };

  return { fullName, firstNameLetter, handleContinueResource };
};
