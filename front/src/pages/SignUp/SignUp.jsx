import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, SignUpFormContainer, StyledTitle } from './SignUp.styled';
import SignUpForm from './SignUpForm';

const SignUp = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <StyledTitle level={1}>{t('sign_up.title')}</StyledTitle>
      <SignUpFormContainer>
        <SignUpForm />
      </SignUpFormContainer>
    </Container>
  );
};

export default SignUp;
