import { Col as ColAntd, Row as RowAntd } from 'antd';
import styled from 'styled-components';

export const Row = styled(RowAntd).attrs({
  gutter: [0, 16],
})`
  padding: 1rem;
  width: 100%;
`;

export const Col = styled(ColAntd).attrs({
  span: 24,
})``;
