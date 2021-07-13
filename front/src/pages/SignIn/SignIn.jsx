import { useTranslation } from 'react-i18next';

import SignInForm from './SignInForm';
import * as S from './SignIn.styled';

const SignIn = () => {
  const { t } = useTranslation('sign_in');

  return (
    <S.Container>
      <S.StyledTitle>{t('title')}</S.StyledTitle>
      <S.SignInFormContainer>
        <SignInForm />
      </S.SignInFormContainer>
    </S.Container>
  );
};

export default SignIn;
