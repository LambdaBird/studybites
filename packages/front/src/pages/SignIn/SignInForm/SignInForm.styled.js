import { Button, Form } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const SubmitButton = styled(Button).attrs({
  type: 'primary',
  htmlType: 'submit',
})`
  width: 100%;
`;

export const LinkButton = styled(Button).attrs({ type: 'link', size: 'small' })`
  padding: 0;
  margin-top: 0.5rem;
  color: ${variables['text-color']};
  & > span {
    text-decoration: underline;
  }
`;

export const FormItemAlignEnd = styled(Form.Item)`
  text-align: end;
`;

export const DivAlignCenter = styled.div`
  text-align: center;
`;
