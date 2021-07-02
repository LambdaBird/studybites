import styled from 'styled-components';
import { Row, Col, Statistic, Divider, Avatar } from 'antd';

export const Wrapper = styled(Row)`
  padding: 16px 0;
  box-shadow: 0 4px 4px 0 rgba(240, 241, 242, 1);
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
  padding-left: 1.5rem;
`;

export const StatisticCol = styled(Col)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const StatisticCell = styled(Statistic)`
  padding-left: 2rem;
`;

export const StatisticDivider = styled(Divider)`
  margin: 0 0 0 2rem;
  height: 50%;
`;

export const StyledAvatar = styled(Avatar)`
  color: #f56a00;
  background-color: #fde3cf;
`;
