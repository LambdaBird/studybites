import { useTranslation } from 'react-i18next';

import SignUpForm from './SignUpForm';
import * as S from './SignUp.styled';

const SignUp = () => {
  const { t } = useTranslation('sign_up');

  return (
    <S.Container>
      <S.StyledTitle>{t('title')}</S.StyledTitle>
      <S.SignUpFormContainer>
        <SignUpForm />
      </S.SignUpFormContainer>
    </S.Container>
  );
};

export default SignUp;
