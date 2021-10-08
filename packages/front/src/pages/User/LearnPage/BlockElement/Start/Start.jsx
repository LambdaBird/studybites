import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { NextPropType } from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import * as S from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { START_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

const Start = ({ isSolved }) => {
  const { handleInteractiveClick, id } = useContext(LearnContext);

  const { t } = useTranslation();
  if (isSolved) {
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
