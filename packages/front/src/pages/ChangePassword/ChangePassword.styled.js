import { Button, Form as FormAntd, Typography } from 'antd';
import styled from 'styled-components';

const { Title: TitleAntd, Text } = Typography;

export const Page = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
  display: flex;
  margin-top: 6rem;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled(TitleAntd).attrs({
  level: 2,
})`
  text-align: center;
  margin-top: 1.5rem;
`;

export const TextWrapper = styled.div`
  text-align: center;
`;

export const TitlePasswordChange = styled(TitleAntd).attrs({
  level: 2,
})`
  text-align: center;
`;

export const TextRedirect = styled(Text)`
  text-align: center;
`;

export const Form = styled(FormAntd).attrs({
  name: 'register',
  scrollToFirstError: true,
})`
  margin-top: 1rem;
  max-width: 300px;
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const UpdateButton = styled(Button).attrs({
  type: 'primary',
  htmlType: 'submit',
})`
  width: 100%;
`;
