import styled from 'styled-components';

export const Page = styled.div`
  height: 100%;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
`;

export const StyledRow = styled.div.attrs({
  gutter: [32],
  justify: 'center',
  align: 'top',
})`
  height: 100%;
  width: 100%;
  display: flex;
`;

export const RightCol = styled.div`
  height: 100%;
`;

export const LeftCol = styled.div`
  margin-right: 32px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 3rem;
`;
