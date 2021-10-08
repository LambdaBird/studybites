import { Input } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const StyledInput = styled(Input)`
  .ant-input-prefix {
    margin-right: 0.5rem;
    color: ${variables['placeholder-color']};
  }
`;
