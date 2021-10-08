import styled from 'styled-components';

export const Delimiter = styled.div`
  line-height: 1.6em;
  width: 100%;
  text-align: center;

  &:before {
    display: inline-block;
    content: '***';
    font-size: 30px;
    line-height: 65px;
    height: 30px;
    letter-spacing: 0.2em;
  }
`;
