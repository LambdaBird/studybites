import { Col as ColAntd, Row as RowAntd } from 'antd';
import styled from 'styled-components';

export const StyledIframe = styled.iframe`
  border: none;
`;

export const Row = styled(RowAntd).attrs({
  gutter: [0, 16],
})`
  margin-bottom: 1rem;
`;

export const Col = styled(ColAntd).attrs({
  span: 24,
})``;
