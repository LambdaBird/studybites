import { Avatar as AvatarAntd, Button as ButtonAntd } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const GlobalStyles = createGlobalStyle`
  body{
    background-color: white;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Avatar = styled(AvatarAntd).attrs({
  size: { xs: 48, sm: 64, md: 64, lg: 64, xl: 64, xxl: 64 },
})`
  flex: 0 0 auto;
  color: ${variables['avatar-second-color']};
  background-color: ${variables['avatar-first-color']};
`;

export const Profile = styled.div`
  max-width: 900px;
  width: 100%;
  background-color: ${variables['body-background-color']};
  padding: 2rem;
  border-radius: 2rem;
  margin: 2rem 2rem 2rem 2rem;
`;

export const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;

  & .ant-typography {
    text-align: center;
    margin-bottom: 0;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

export const FormInputsWrapper = styled.div`
  flex: 1 1 49%;
`;

export const SaveWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: 767px) {
    justify-content: center;
    flex: 1 1 100%;
    button {
      width: 100%;
    }
  }
`;

export const Button = styled(ButtonAntd).attrs({
  type: 'primary',
})`
  width: 150px;
`;
