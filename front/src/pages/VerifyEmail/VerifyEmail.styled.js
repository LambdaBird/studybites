import { Typography } from 'antd';
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
