import styled from 'styled-components';
import { Row, Col, Statistic, Divider } from 'antd';

export const Wrapper = styled(Row)`
  padding: 16px 24px 16px 24px;
  box-shadow: 0px 4px 4px 0px rgba(240, 241, 242, 1);
  background: rgba(255, 255, 255, 1);
`;

export const AvatarCol = styled(Col)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const TextCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 24px; 
`;

export const StatisticCol = styled(Col)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const StatisticCell = styled(Statistic)`
  padding-left: 32px; 
`;

export const StatisticDivider = styled(Divider)`
  margin: 0 0 0 32px;
`;