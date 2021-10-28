import { Row } from 'antd';
import styled from 'styled-components';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import variables from '@sb-ui/theme/variables';

export const BlockElementWrapperWhite = styled(Row)`
  width: 100%;
  background-color: white;
  box-shadow: 0 0 10px 8px rgba(231, 231, 231, 0.5);
  border-radius: 8px;
  max-width: 614px;
  display: flex;
  padding: 0.5rem 1rem;

  @media (max-width: 767px) {
    box-shadow: 0px -4px 10px rgba(231, 231, 231, 0.5);
    max-width: none;
    overflow-x: hidden;
    width: 100vw;
  }
`;

export const SuccessCircle = styled(CheckCircleTwoTone).attrs({
  twoToneColor: variables['success-color'],
})`
  font-size: 24px;
`;

export const PartialFailCircle = styled(CloseCircleTwoTone).attrs({
  twoToneColor: variables['partial-wrong-color'],
})`
  font-size: 24px;
`;

export const FailCircle = styled(CloseCircleTwoTone).attrs({
  twoToneColor: variables['wrong-color'],
})`
  font-size: 24px;
`;
