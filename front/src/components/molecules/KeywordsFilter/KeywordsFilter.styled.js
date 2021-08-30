import { Select as AntdSelect } from 'antd';
import styled from 'styled-components';

export const Select = styled(AntdSelect)`
  width: ${({ width }) => width};
  margin-left: ${({ margin }) => margin};
  margin-right: ${({ margin }) => margin};
`;
