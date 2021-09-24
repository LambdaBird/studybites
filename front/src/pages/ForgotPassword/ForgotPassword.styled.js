import { Button, Form as FormAntd, Typography } from 'antd';
import styled from 'styled-components';

const { Title: TitleAntd, Text } = Typography;

export const Page = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

export const Title = styled(TitleAntd).attrs({
  level: 2,
})`
  text-align: center;
  margin-top: 4rem;
`;

export const Form = styled(FormAntd).attrs({
  name: 'forgot-password',
})`
  text-align: center;
  margin-top: 3.5rem;
  max-width: 400px;
  width: 100%;
`;

export const ResetButton = styled(Button).attrs({
  type: 'primary',
  htmlType: 'submit',
})`
  margin-bottom: 1.5rem;
  width: 100%;
`;

export const BackLink = styled(Text)`
  text-decoration: underline;
  cursor: pointer;
`;
