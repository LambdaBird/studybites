import styled from 'styled-components';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import variables from '@sb-ui/theme/variables';

export const AnswerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const SuccessCircle = styled(CheckCircleTwoTone).attrs({
  twoToneColor: variables['success-color'],
})``;

export const FailCircle = styled(CloseCircleTwoTone).attrs({
  twoToneColor: variables['wrong-color'],
})``;
