import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { NextPropType } from '@sb-ui/pages/User/LessonPage/BlockElement/types';
import * as S from '@sb-ui/pages/User/LessonPage/LessonPage.styled';
import { START_TYPE } from '@sb-ui/pages/User/LessonPage/utils';

const Start = ({ response }) => {
  const { handleInteractiveClick, id } = useContext(LearnContext);

  const { t } = useTranslation();
  if (response.isSolved) {
    return null;
  }

  return (
    <S.LessonButton
      onClick={() => handleInteractiveClick({ id, action: START_TYPE })}
    >
      {t('user:lesson.start')}
    </S.LessonButton>
  );
};

Start.propTypes = NextPropType;

export default Start;
