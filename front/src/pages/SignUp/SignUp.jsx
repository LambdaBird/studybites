import { useTranslation } from 'react-i18next';
import { Container, SignUpFormContainer, StyledTitle } from './SignUp.styled';
import SignUpForm from './SignUpForm';

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
