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

export const DivAlignCenter = styled.div`
  text-align: center;
`;

export const FormItemPassword = styled(Form.Item)`
  margin-bottom: 0;
  height: 100px;
`;
