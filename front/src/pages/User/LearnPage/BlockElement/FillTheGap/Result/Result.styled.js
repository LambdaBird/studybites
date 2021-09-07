import styled from 'styled-components';
import { WarningTwoTone as WarningTwoToneAntd } from '@ant-design/icons/lib/icons';

export const AnswerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ResultWrapper = styled.div`
  padding-top: 1rem;
`;

export const WarningTwoTone = styled(WarningTwoToneAntd)`
  font-size: x-large;
`;
