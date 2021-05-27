import styled from 'styled-components';
import { Row, Image, Col } from 'antd';


export const Wrapper = styled(Row)`
  margin-top: 48px;
`;

export const CardCol = styled(Col)`
  min-height: 100%;
`;

export const DashboardControls = styled(Row)`
  width: 100%;
`;

export const DashboardLessons = styled(Row)`
  height: 100%;
  min-height: 60vh;
`;

export const IconImage = styled(Image)`
  padding: 6px 8px 0 0; 
`;
