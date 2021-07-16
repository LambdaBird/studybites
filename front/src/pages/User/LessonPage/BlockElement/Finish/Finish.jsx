import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import * as S from '@sb-ui/pages/User/LessonPage/LessonPage.styled';
import { FINISH_TYPE } from '@sb-ui/pages/User/LessonPage/utils';

import { NextPropType } from '../types';

const Finish = ({ revision, blockId, response }) => {
  const { mutate, id } = useContext(LearnContext);

  const { t } = useTranslation();
  if (response.isSolved) {
    return null;
  }

  return (
    <S.LessonButton
      onClick={() => mutate({ id, action: FINISH_TYPE, revision, blockId })}
    >
      {t('user:lesson.finish')}
    </S.LessonButton>
  );
};

Finish.propTypes = NextPropType;

export default Finish;
