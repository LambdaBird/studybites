import styled from 'styled-components';

export const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 3rem;

  @media (max-width: 767px) {
    padding: 2rem;
  }
`;
