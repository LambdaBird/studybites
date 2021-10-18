import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  padding: 1rem;
  background-color: white;
  border-radius: 1rem;
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const IconTitle = styled.div`
  display: flex;
  @media (max-width: 767px) {
    align-items: center;
  }
`;

export const Title = styled.span`
  font-weight: bold;
  text-align: center;
`;

export const Message = styled.span`
  @media (min-width: 767px) {
    padding-left: 1rem;
  }
`;
