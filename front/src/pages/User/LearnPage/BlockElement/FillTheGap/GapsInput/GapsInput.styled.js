import { Input as InputAntd, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

export const Input = styled(InputAntd).attrs({
  type: 'text',
})`
  width: 150px;
`;

export const Wrapper = styled(Text)`
  font-style: italic;
  line-height: 2.5rem;
`;

export const CorrectSpan = styled.span`
  color: green;
`;

export const WrongSpan = styled.span`
  color: red;
`;
