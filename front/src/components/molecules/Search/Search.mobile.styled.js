import { Button } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const StyledSearchButton = styled(Button)`
  ${({ $isActive }) =>
    $isActive &&
    `
      color: ${variables['primary-color']};
      border-color: ${variables['primary-color']};
  `};
`;
