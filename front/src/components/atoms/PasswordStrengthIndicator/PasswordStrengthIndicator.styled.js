import styled from 'styled-components';

const noLevelColor = 'lightgray';

export const LineDiv = styled.div`
  background-color: ${noLevelColor};
  width: 100%;
  margin-top: 4px;
  height: 4px;
`;

const levelsColor = ['#ff4033', '#fe940d', '#ffd908', '#6ecc3a'];

export const IndicatorDiv = styled.div`
  position: absolute;
  display: inline-block;
  transition: width 250ms ease;
  width: ${(props) => `${((+props.level + 1) / levelsColor.length) * 100}%`};
  background-color: ${(props) => levelsColor[props.level]};
  height: 4px;
`;
