import { Button, Popover as PopoverAntd } from 'antd';
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

export const Popover = styled(PopoverAntd).attrs({
  trigger: 'click',
})`
  margin-right: ${(props) => props.marginRight || '0px'};
`;
