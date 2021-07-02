import variables from '@sb-ui/theme/variables';
import { Button } from 'antd';
import styled from 'styled-components';

export const StyledSearchButton = styled(Button)`
  ${({ $isActive }) =>
    $isActive &&
    `
      color: ${variables['primary-color']};
      border-color: ${variables['primary-color']};
  `};
`;
