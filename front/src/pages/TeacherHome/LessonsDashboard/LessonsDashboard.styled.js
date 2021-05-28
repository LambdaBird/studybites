import styled from 'styled-components';
import { Row, Image, Col } from 'antd';


export const Wrapper = styled(Row)`
  margin-top: 48px;
`;

export const CardCol = styled(Col)`
  height: 22%;
`;

export const DashboardControls = styled(Row)`
  width: 100%;
`;

export const DashboardLessons = styled(Row)`
  max-height: 70vh;
  overflow: hidden;
`;

export const IconImage = styled(Image)`
  padding: 6px 8px 0 0; 
`;
