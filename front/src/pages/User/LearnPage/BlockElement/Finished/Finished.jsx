import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Results from '@sb-ui/pages/User/LearnPage/BlockElement/Results';
import * as S from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import { NextPropType } from '../types';

const Finished = () => {
  const history = useHistory();
  const { t } = useTranslation('user');

  return (
    <>
      <Results />
      <S.LessonButton onClick={history.goBack}>
        {t('lesson.back')}
      </S.LessonButton>
    </>
  );
};

Finished.propTypes = NextPropType;

export default Finished;
