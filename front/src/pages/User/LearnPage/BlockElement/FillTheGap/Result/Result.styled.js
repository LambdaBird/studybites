import { Input as InputAntd, Typography } from 'antd';
import styled from 'styled-components';
import { WarningTwoTone as WarningTwoToneAntd } from '@ant-design/icons/lib/icons';

const { Text } = Typography;

export const AnswerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const WarningTwoTone = styled(WarningTwoToneAntd)`
  font-size: x-large;
`;

export const Input = styled(InputAntd).attrs({
  type: 'text',
  disabled: true,
})`
  width: 150px;
`;

export const CorrectSpan = styled.span`
  color: green;
`;

export const WrongSpan = styled.span`
  color: red;
`;

export const ResultWrapper = styled.div`
  padding-top: 1rem;
`;

export const ChunkText = styled(Text)`
  font-style: italic;
  line-height: 2.5rem;
`;
