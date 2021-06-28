import styled from 'styled-components';
import variables from '@sb-ui/theme/variables';
import { Checkbox } from 'antd';

export const DisabledCheckbox = styled(Checkbox)`
  cursor: default !important;
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${variables['checkbox-disabled']};
    border-color: ${variables['checkbox-disabled']};
  }
  .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: white;
  }
  .ant-checkbox-input {
    cursor: default;
  }
  .ant-checkbox-disabled + span {
    color: inherit;
    cursor: default;
  }
`;
