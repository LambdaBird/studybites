import { Collapse as CollapseAntd } from 'antd';
import styled from 'styled-components';

const { Panel: PanelAntd } = CollapseAntd;

export const Time = styled.span`
  font-size: 1rem;
  display: flex;
  gap: 0.5rem;
`;

export const Wrapper = styled.div`
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Start = styled.div`
  margin-bottom: 1rem;
  text-align: center;
`;
export const Finish = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
    pointer-events: ${(props) => (props.isResult ? 'auto' : 'none')};
  }
  pointer-events: none;
  padding: 0.5rem 1rem;
`;
