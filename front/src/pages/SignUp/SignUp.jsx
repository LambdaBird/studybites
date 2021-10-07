import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { sbPostfix } from '@sb-ui/utils/constants';

import SignUpForm from './SignUpForm';
import * as S from './SignUp.styled';

const SignUp = () => {
  const { t } = useTranslation('sign_up');

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
        <S.SignUpFormContainer>
          <SignUpForm />
        </S.SignUpFormContainer>
      </S.Container>
    </>
  );
};

export default SignUp;
