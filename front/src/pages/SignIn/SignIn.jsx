import React from 'react';
import { useTranslation } from 'react-i18next';
import SignInForm from './SignInForm';
import { Container, StyledTitle, SignInFormContainer } from './SignIn.styled';

const SignIn = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <StyledTitle level={1}>{t('sign_in.title')}</StyledTitle>
      <SignInFormContainer>
        <SignInForm />
      </SignInFormContainer>
    </Container>
  );
};

export default SignIn;
