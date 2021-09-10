import { Button, List as ListAntd } from 'antd';
import styled from 'styled-components';

const HEIGHT = 300;

export const List = styled(ListAntd).attrs({
  bordered: true,
})`
  position: absolute;
  width: ${HEIGHT}px;
  left: calc(50% - ${HEIGHT / 2 || 0}px);
  z-index: 6;
  background: white;

  .ant-list-items {
    overflow-y: scroll;
    max-height: 500px;
  }

  .ant-list-footer {
    padding: 0;
  }

  .ant-list-item {
    padding: 0;
  }
`;

export const ApplyButton = styled(Button)`
  height: 100%;
  width: 100%;
`;

export const FilterButton = styled(Button).attrs({
  size: 'large',
  type: 'circle',
})``;

export const ListItemContent = styled.div`
  padding: 12px 24px;
  width: 100%;
  background-color: ${(props) => (props.checked ? '#E6F7FF' : 'white')};
`;

export const FilterBackground = styled.div`
  position: fixed;
  min-height: 100%;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.5);
`;
