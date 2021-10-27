import styled from 'styled-components';

export const SeriesWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const TickWrapper = styled.div`
  display: flex;
  font-size: 0.75em;
  position: relative;
  color: #888;
  width: 40px;
`;

export const MedianWrapper = styled(TickWrapper)`
  align-items: flex-start;
  justify-content: flex-end;
  text-align: right;
  left: -2px;
  top: -2px;
`;

export const MeanWrapper = styled(TickWrapper)`
  align-items: flex-end;
  justify-content: flex-start;
  text-align: left;
  left: 6px;
  top: -0.5em;
`;

const HeaderWrapper = styled(TickWrapper)`
  align-items: flex-end;
  top: -4px;
  color: #555;
`;

export const HeaderMeanWrapper = styled(HeaderWrapper)`
  justify-content: flex-start;
  text-align: left;
  left: 2px;
`;

export const HeaderMedianWrapper = styled(HeaderWrapper)`
  text-align: right;
  justify-content: flex-end;
  left: -2px;
`;

export const SparkWrapper = styled.div`
  padding: 0.2em 1px;
  width: ${({ $sparkWidth }) => $sparkWidth}px;
`;
