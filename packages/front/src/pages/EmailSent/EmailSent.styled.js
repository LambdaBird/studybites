import { Empty as EmptyAntd, Typography } from 'antd';
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

export const Description = styled(Text)`
  font-size: 1rem;
  max-width: 350px;
  text-align: center;
  margin-top: 1.5rem;
`;

export const Title = styled(TitleAntd).attrs({
  level: 2,
})`
  margin-top: 1.5rem;
`;

export const BackLink = styled(Text)`
  margin-top: 1.5rem;
  text-decoration: underline;
  cursor: pointer;
`;

export const Empty = styled(EmptyAntd).attrs({
  description: false,
})`
  margin-top: 3rem;
`;
