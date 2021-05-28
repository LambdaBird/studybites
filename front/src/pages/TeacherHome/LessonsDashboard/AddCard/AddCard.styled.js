import styled from 'styled-components';
import { Row, Typography } from 'antd';

const { Title } = Typography

export const Wrapper = styled(Row)`
  height: 100%;
  box-shadow: 0px 2px 8px 0px #00000026;
  background: rgba(255, 255, 255, 1);
`;

export const CardTitle = styled(Title)`
  padding-top: 0.5em;
`;
