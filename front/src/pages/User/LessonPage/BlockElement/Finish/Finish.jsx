import { useTranslation } from 'react-i18next';

import * as S from '@sb-ui/pages/User/LessonPage/LessonPage.styled';

import { NextPropType } from '../types';

const Finish = ({ response, handleNextClick }) => {
  const { t } = useTranslation();
  if (response.isSolved) {
    return null;
  }

  return (
    <S.LessonButton onClick={handleNextClick}>
      {t('user:lesson.finish')}
    </S.LessonButton>
  );
};

Finish.propTypes = NextPropType;

export default Finish;
