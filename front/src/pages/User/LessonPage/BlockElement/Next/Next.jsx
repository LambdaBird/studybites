import { useTranslation } from 'react-i18next';

import * as S from '@sb-ui/pages/User/LessonPage/LessonPage.styled';

import { NextPropType } from '../types';

const Next = ({ response, handleNextClick }) => {
  const { t } = useTranslation();
  if (response.isSolved) {
    return null;
  }

  return (
    <S.LessonButton onClick={handleNextClick}>
      {t('user:lesson.next')}
    </S.LessonButton>
  );
};

Next.propTypes = NextPropType;

export default Next;
