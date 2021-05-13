import styled from 'styled-components';

export const LineDiv = styled.div`
  line-height: 4px;
`;

export const IndicatorDiv = styled.div`
  display: inline-block;
  width: 25%;
  background-color: ${(props) => props.color};
  height: ${(props) => props.height}px;
  border-radius: 2px;
`;
