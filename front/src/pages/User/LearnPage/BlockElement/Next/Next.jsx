import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import * as S from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { NEXT_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import { NextPropType } from '../types';

const Next = ({ blockId, revision, isSolved }) => {
  const { handleInteractiveClick, id } = useContext(LearnContext);
  const { t } = useTranslation();
  if (isSolved) {
    return null;
  }

  return (
    <S.LessonButton
      onClick={() =>
        handleInteractiveClick({
          id,
          action: NEXT_TYPE,
          revision,
          blockId,
          data: {
            isSolved: true,
          },
        })
      }
    >
      {t('user:lesson.next')}
    </S.LessonButton>
  );
};

Next.propTypes = NextPropType;

export default Next;
