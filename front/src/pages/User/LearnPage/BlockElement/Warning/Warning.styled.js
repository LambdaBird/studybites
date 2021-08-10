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

export const Icon = styled.span.attrs({
  ariaLabel: 'hand-up',
  role: 'img',
})`
  font-size: large;
`;

export const Title = styled.span`
  padding-left: 1rem;
  font-weight: bold;
  text-align: center;
`;

export const Message = styled.span`
  padding-left: 1rem;
`;
