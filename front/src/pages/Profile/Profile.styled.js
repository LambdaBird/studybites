import { Button as ButtonAntd } from 'antd';
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Profile = styled.div`
  max-width: 900px;
  width: 100%;
  background-color: white;
  padding: 2rem;
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
  gap: 3rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

export const FormInputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

export const Button = styled(ButtonAntd).attrs({
  type: 'primary',
  size: 'large',
})`
  min-width: 185px;
  margin-left: auto;
`;

export const ResetButton = styled(Button)`
  margin-top: auto;
`;
