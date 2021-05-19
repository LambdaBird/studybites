import styled from 'styled-components';
import { Button, Form, Typography } from 'antd';

const { Text } = Typography;

export const SubmitButton = styled(Button)`
  width: 100%;
`;

export const TextLink = styled(Text)`
  cursor: pointer;
  &:hover {
  }
`;

export const FormItemBottomEmpty = styled(Form.Item)`
  margin-bottom: 0;
`;

export const FormItemAlignEnd = styled(Form.Item)`
  text-align: end;
`;

export const DivAlignCenter = styled.div`
  text-align: center;
`;
