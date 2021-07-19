import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import * as S from '@sb-ui/pages/User/LessonPage/LessonPage.styled';
import { NEXT_TYPE } from '@sb-ui/pages/User/LessonPage/utils';

import { NextPropType } from '../types';

const Next = ({ blockId, revision, response }) => {
  const { handleInteractiveClick, id } = useContext(LearnContext);
  const { t } = useTranslation();
  if (response.isSolved) {
    return null;
  }

  return (
    <S.LessonButton
      onClick={() =>
        handleInteractiveClick({ id, action: NEXT_TYPE, revision, blockId })
      }
    >
      {t('user:lesson.next')}
    </S.LessonButton>
  );
};

Next.propTypes = NextPropType;

export default Next;
