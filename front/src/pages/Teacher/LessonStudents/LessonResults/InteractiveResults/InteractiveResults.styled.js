import { Collapse as CollapseAntd } from 'antd';
import styled from 'styled-components';

const { Panel: PanelAntd } = CollapseAntd;

export const Collapse = styled(CollapseAntd)`
  background-color: white;
  user-select: none;
`;

export const Panel = styled(PanelAntd).attrs({
  showArrow: false,
})`
  &:hover {
    background-color: whitesmoke;
  }
  .ant-collapse-header {
    pointer-events: ${(props) => (props.$isResult ? 'auto' : 'none')};
  }
  pointer-events: none;
  padding: 0.5rem 1rem;
`;
