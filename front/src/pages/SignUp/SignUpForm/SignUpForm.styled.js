import styled from 'styled-components';
import { Button } from 'antd';
import variables from '@sb-ui/theme/variables';

export const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

export const LinkButton = styled(Button).attrs({ type: 'link', size: 'small' })`
  padding: 0;
  margin-top: 0.5rem;
  color: ${variables['text-color']};
  & > span {
    text-decoration: underline;
  }
`;
export const DivAlignCenter = styled.div`
  text-align: center;
`;
