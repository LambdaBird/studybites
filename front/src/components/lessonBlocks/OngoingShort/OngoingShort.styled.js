import styled from 'styled-components';
import { Col, Progress, Row } from 'antd';

import variables from '@sb-ui/theme/variables';
import { WHITE_COLOR } from '@sb-ui/resources/styles/Global.styled';

export const MainSpace = styled(Row)`
  max-height: 150px;
  background-color: ${WHITE_COLOR};
  padding: 0.5rem 0.5rem 0;
  flex-wrap: nowrap;
`;

export const LeftColumn = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const RightColumn = styled(Col)`
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 0.5rem;
`;

export const ProgressBar = styled(Progress)`
  padding: 0.5rem 0;

  .ant-progress-bg {
    background-color: ${variables['primary-color']} !important;
  }

  .ant-progress-text {
    color: ${variables['secondary-text-color']} !important;
  }
`;

export const StyledImage = styled.img`
  height: 100%;
`;
