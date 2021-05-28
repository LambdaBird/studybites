import styled from 'styled-components';

import { Col, Progress, Row } from 'antd';
import { WHITE_COLOR } from '../../../resources/styles/Global.styled';

export const MainSpace = styled(Row)`
  max-height: 150px;
  background-color: ${WHITE_COLOR};
  padding: 0.5rem 1rem 1rem 0.5rem;
  flex-wrap: nowrap;
`;

export const LeftColumn = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const RightColumn = styled(Col)`
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ProgressBar = styled(Progress)``;
