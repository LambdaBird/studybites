import {
  Avatar as AvatarAntd,
  Button as ButtonAntd,
  Form as FormAntd,
  Input,
} from 'antd';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';

export const Page = styled.div`
  display: flex;
  justify-content: center;
`;

export const Container = styled.div`
  max-width: 500px;
  width: 100%;
`;

export const Button = styled(ButtonAntd).attrs({
  type: 'primary',
  htmlType: 'submit',
})`
  width: 100%;
`;

export const JoinButton = styled(ButtonAntd).attrs({
  type: 'primary',
})`
  margin-top: 1rem;
  width: 100%;
`;

export const Form = styled(FormAntd).attrs({
  layout: 'vertical',
  size: 'large',
})`
  margin-top: 1rem;
`;

export const HeaderBlock = styled.div`
  background-color: white;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const HeaderTitle = styled.div`
  margin-left: 1rem;
`;

export const Avatar = styled(AvatarAntd).attrs({
  size: 'large',
  icon: <UserOutlined />,
})``;

export const BodyBlock = styled.div`
  background-color: white;
  padding: 2rem;
`;

export const EmailInput = styled(Input)`
  margin-bottom: 1.5rem;
`;
