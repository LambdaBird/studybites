import styled, { css } from 'styled-components';

export const FunnelWrapper = styled.div`
  display: grid;
  grid-template-columns: 12fr 1fr 1fr 6fr 12fr;
  grid-auto-rows: 1fr;
  width: 1000px;
`;

export const TypeWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0 1em;
  align-items: center;
  > div {
    flex-basis: 2em;
    text-align: center;
  }
  path {
    fill: #000;
  }
`;

export const LessonStarted = styled.div`
  text-align: center;
  font-weight: 700;
  width: 100%;
  flex-basis: 100%;
  flex-grow: 1;
`;

export const NumberWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 1em;
`;

const diffColors = ['#d46b08', '#fa541c', '#f5222d'];

export const DiffNumber = styled.div`
  color: ${({ value }) =>
    diffColors[Math.min(Math.max(Math.floor((value / 100) * 7) - 2, 0), 2)]};
  font-size: 0.75em;
  padding-left: 0.5em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const BiteBarWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const countWidthPercent = ({ landed, initialLanded }) =>
  Math.floor((landed / initialLanded) * 100);
const getOpacity = ({ whole, number }) =>
  number === whole ? 1 : 0.2 + (number * 2) / (whole * 3);
const barColor = css`
  background-color: rgba(0, 0, 200, ${getOpacity});
  padding: 0;
  margin: 0;
`;

export const BiteBar = styled.div`
  width: ${countWidthPercent}%;
  ${barColor}
`;
