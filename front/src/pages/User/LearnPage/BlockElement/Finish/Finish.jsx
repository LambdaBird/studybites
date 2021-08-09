import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import LearnContext from '@sb-ui/contexts/LearnContext';
import Results from '@sb-ui/pages/User/LearnPage/BlockElement/Results';
import * as S from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { FINISH_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import { NextPropType } from '../types';

const Finish = ({ isSolved }) => {
  const history = useHistory();
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id } = useContext(LearnContext);

  const callbackRef = (node) => node?.scrollIntoView({ behavior: 'smooth' });

  if (isSolved) {
    return (
      <>
        <Results callbackRef={callbackRef} />
        <S.LessonButton onClick={history.goBack}>
          {t('lesson.back')}
        </S.LessonButton>
      </>
    );
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
