import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import * as S from '@sb-ui/pages/User/LessonPage/LessonPage.styled';
import { START_TYPE } from '@sb-ui/pages/User/LessonPage/utils';

const Start = () => {
  const { mutate, id } = useContext(LearnContext);

  const { t } = useTranslation();

  return (
    <S.LessonButton onClick={() => mutate({ id, action: START_TYPE })}>
      {t('user:lesson.start')}
    </S.LessonButton>
  );
};

export default Start;
