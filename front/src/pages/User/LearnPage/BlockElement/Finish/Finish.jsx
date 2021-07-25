import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import * as S from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { FINISH_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import { NextPropType } from '../types';

const Finish = ({ isSolved }) => {
  const { handleInteractiveClick, id } = useContext(LearnContext);

  const { t } = useTranslation();
  if (isSolved) {
    return null;
  }

  return (
    <S.LessonButton
      onClick={() => handleInteractiveClick({ id, action: FINISH_TYPE })}
    >
      {t('user:lesson.finish')}
    </S.LessonButton>
  );
};

Finish.propTypes = NextPropType;

export default Finish;
