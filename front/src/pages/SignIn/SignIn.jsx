import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { sbPostfix } from '@sb-ui/utils/constants';

import SignInForm from './SignInForm';
import * as S from './SignIn.styled';

const SignIn = () => {
  const { t } = useTranslation('sign_in');

  return (
    <>
      <Helmet>
        <title>
          {t('title')}
          {sbPostfix}
        </title>
      </Helmet>
      <S.Container>
        <S.StyledTitle>{t('title')}</S.StyledTitle>
        <S.SignInFormContainer>
          <SignInForm />
        </S.SignInFormContainer>
      </S.Container>
    </>
  );
};

export default SignIn;
