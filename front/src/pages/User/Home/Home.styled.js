import styled from 'styled-components';

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  padding: 3rem;
  @media (max-width: 767px) {
    padding: 1rem;
  }
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`;
