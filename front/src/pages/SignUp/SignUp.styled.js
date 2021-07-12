import { Typography } from 'antd';
import styled from 'styled-components';

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
  margin: 0 auto 16rem;
`;

export const SignUpFormContainer = styled.div`
  width: 90%;
`;
