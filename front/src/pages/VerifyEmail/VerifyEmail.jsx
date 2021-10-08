import { Spin } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

import { verifyEmail } from '@sb-ui/utils/api/v1/email';
import { HOME } from '@sb-ui/utils/paths';
import { EMAIL_VERIFY_EMAIL } from '@sb-ui/utils/queries';

import * as S from './VerifyEmail.styled';

const TIME_TO_REDIRECT_HOME_FAIL = 5000;
const TIME_TO_REDIRECT_HOME_SUCCESS = 3000;

const VERIFY_SUCCESS = 'verify_success';
const VERIFY_FAIL = 'verify_fail';

const VerifyEmail = () => {
  const { t } = useTranslation('verify_email');
  const history = useHistory();
  const { id } = useParams();

  const [emailVerification, setEmailVerification] = useState(null);

  const handleVerification = useCallback(
    (verification, timeToRedirect) => {
      if (!emailVerification) {
        setEmailVerification(verification);
      }
      setTimeout(() => {
        history.push(HOME);
      }, timeToRedirect);
    },
    [emailVerification, history],
  );

  const { isLoading } = useQuery([EMAIL_VERIFY_EMAIL, { id }], verifyEmail, {
    retry: false,
    enabled: !!id,
    onSuccess: () => {
      handleVerification(VERIFY_SUCCESS, TIME_TO_REDIRECT_HOME_SUCCESS);
    },
    onError: () => {
      handleVerification(VERIFY_FAIL, TIME_TO_REDIRECT_HOME_FAIL);
    },
  });

  return (
    <S.Page>
      {!isLoading && emailVerification && (
        <S.TextWrapper>
          <S.TitlePasswordChange>{t(emailVerification)}</S.TitlePasswordChange>
          <S.TextRedirect>{t('redirect_text')}</S.TextRedirect>
        </S.TextWrapper>
      )}
      {isLoading && <Spin tip={t('loading')} />}
    </S.Page>
  );
};

export default VerifyEmail;
