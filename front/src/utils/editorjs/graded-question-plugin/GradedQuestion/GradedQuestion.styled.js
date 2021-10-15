import styled from 'styled-components';

export const Input = styled.div.attrs({
  className: 'cdx-input',
  contentEditable: true,
})``;

export const Bottom = styled.div`
  display: flex;
  margin-top: 0.5rem;
  justify-content: flex-end;
  align-items: center;
`;

export const Text = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
  margin-right: 1rem;
`;
