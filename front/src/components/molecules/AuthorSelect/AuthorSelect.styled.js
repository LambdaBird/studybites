import { Select as AntdSelect } from 'antd';
import styled from 'styled-components';

export const Select = styled(AntdSelect).attrs({
  maxTagCount: 'responsive',
  mode: 'multiple',
})`
  width: ${({ width }) => width};
`;
