import { useTranslation } from 'react-i18next';

import SignUpForm from './SignUpForm';
import { Container, SignUpFormContainer, StyledTitle } from './SignUp.styled';

const SignUp = () => {
  const { t } = useTranslation('sign_up');

  return (
    <Container>
      <StyledTitle level={1}>{t('title')}</StyledTitle>
      <SignUpFormContainer>
        <SignUpForm />
      </SignUpFormContainer>
    </Container>
  );
};

export default SignUp;
