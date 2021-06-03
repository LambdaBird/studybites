import styled from 'styled-components';
import { Typography } from 'antd';

const { Title } = Typography;

export const StyledTitle = styled(Title)`
  margin-bottom: 2rem !important;
`;

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 16rem;
`;

export const SignInFormContainer = styled.div`
  width: 90%;
`;
