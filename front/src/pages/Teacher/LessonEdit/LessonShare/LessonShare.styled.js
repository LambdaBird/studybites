import {
  Button as ButtonAntd,
  Col as ColAntd,
  Input as InputAntd,
  Row as RowAntd,
} from 'antd';
import styled from 'styled-components';

export const Input = styled(InputAntd).attrs({
  spellCheck: false,
})`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
`;

export const Button = styled(ButtonAntd)`
  background-color: #fafafa;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

export const GenerateButton = styled(Button)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

export const Col = styled(ColAntd).attrs({
  span: 24,
})``;

export const Row = styled(RowAntd).attrs({
  gutter: [0, 8],
})``;

export const LinkWrapper = styled(Col)`
  display: flex;
`;
