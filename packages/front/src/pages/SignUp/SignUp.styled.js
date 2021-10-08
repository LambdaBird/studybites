import { Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const StyledTitle = styled(Title).attrs({
  level: 1,
})`
  margin-bottom: 2rem !important;
`;

export const Container = styled.div`
  height: 100%;
  width: 100%;
  max-width: 448px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto 16rem;
  padding: 1rem;
`;

export const SignUpFormContainer = styled.div`
  width: 90%;
`;
