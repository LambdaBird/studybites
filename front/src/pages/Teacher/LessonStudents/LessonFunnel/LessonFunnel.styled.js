import styled, { css } from 'styled-components';

export const FunnelWrapper = styled.div`
  display: grid;
  grid-template-columns: 12fr 1fr 1fr 6fr 12fr;
  grid-auto-rows: 1fr;
  grid-row-gap: 8px;
  width: 1000px;
`;

export const TypeWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0 1em;
  align-items: center;
  > div {
    flex-basis: 2em;
  }
  path {
    fill: #000;
  }
`;

export const LessonStarted = styled.div`
  font-weight: 500;
  width: 100%;
  flex-basis: 100%;
  flex-grow: 1;
  text-align: left;
`;

export const NumberWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 1em;
`;

const diffColors = ['#8c8c8c', '#d5222d', '#f5222d'];

export const DiffNumber = styled.div`
  color: ${({ value }) =>
    diffColors[Math.min(Math.max(Math.floor((value / 100) * 7) - 2, 0), 2)]};
  font-size: 0.75em;
  padding-left: 0.5em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const Percentage = styled.div`
  color: ${({ value }) =>
    diffColors[Math.min(Math.max(Math.floor((value / 100) * 7) - 2, 0), 2)]};
  font-size: 0.75em;
  display: flex;
  align-items: center;
  align-self: start;
  justify-content: flex-end;
  flex-grow: 1;
`;

export const BiteBarWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const countWidthPercent = ({ landed, initialLanded }) =>
  Math.floor((landed / initialLanded) * 100);

const barColor = css`
  background-color: rgba(9, 140, 140, 0.2);
  padding: 0;
  margin: 0;
`;

export const BiteBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: ${countWidthPercent}%;
  ${barColor}
`;

export const LandedNumber = styled.div`
  padding: 0.3em;
  text-align: right;
  font-size: 1em;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.85);
`;

export const ColumnsTitle = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.85);
`;
