import { useTranslation } from 'react-i18next';

import SignInForm from './SignInForm';
import { Container, SignInFormContainer,StyledTitle } from './SignIn.styled';

const SignIn = () => {
  const { t } = useTranslation('sign_in');

  return (
    <Container>
      <StyledTitle level={1}>{t('title')}</StyledTitle>
      <SignInFormContainer>
        <SignInForm />
      </SignInFormContainer>
    </Container>
  );
};

export default SignIn;
