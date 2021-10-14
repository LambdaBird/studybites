import styled from 'styled-components';

export const RowResult = styled.div`
  display: flex;
  align-items: center;
  width: 600px;

  @media (max-width: 767px) {
    width: auto;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const Icon = styled.div`
  & svg {
    path {
      fill: #000;
    }
    height: 25px;
    width: 25px;
  }
`;

export const IconTitle = styled.div`
  margin-left: 1rem;
`;

export const IconWrapper = styled.div`
  display: flex;
  flex: 1 0 33%;
  align-items: center;
`;

export const Time = styled.div`
  flex: 1 0 33%;
  display: flex;
  justify-content: center;
`;

export const Correctness = styled.div`
  flex: 1 0 33%;
  display: flex;
  justify-content: flex-end;
`;
