import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { getJWTAccessToken } from '@sb-ui/utils/jwt';
import { PROFILE, SIGN_IN } from '@sb-ui/utils/paths';

import * as S from './EmailSent.styled';

const EmailSent = () => {
  const isAuth = getJWTAccessToken();
  const history = useHistory();
  const { t } = useTranslation('email');

  const backTextKey = isAuth ? 'back_profile' : 'back_sign_in';

  const handleBackClick = useCallback(() => {
    if (isAuth) {
      history.push(PROFILE);
    } else {
      history.push(SIGN_IN);
    }
  }, [history, isAuth]);

  return (
    <S.Page>
      <S.Empty />
      <S.Title>{t('title')}</S.Title>
      <S.Description>{t('description')}</S.Description>
      <S.BackLink onClick={handleBackClick}>{t(backTextKey)}</S.BackLink>
    </S.Page>
  );
};

export default EmailSent;
