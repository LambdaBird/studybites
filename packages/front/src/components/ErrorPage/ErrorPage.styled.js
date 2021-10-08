import { Result as ResultAntd } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const Result = styled(ResultAntd)`
  ${(props) =>
    props.status === '404' &&
    `& g path:nth-child(11) {
      fill: ${variables['primary-color']};
    }`}
`;
