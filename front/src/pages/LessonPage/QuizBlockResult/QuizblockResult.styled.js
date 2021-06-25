import styled from 'styled-components';
import { Checkbox, Row } from 'antd';

export const StyledRow = styled(Row)`
  width: 100%;
`;

export const ColumnCheckbox = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
  input[type='checkbox'] {
    background-color: green;
  }
`;
