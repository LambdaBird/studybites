import styled from 'styled-components';
import { Typography } from 'antd';

const { Paragraph } = Typography;

export const CustomTableWrapper = styled.div`
  margin-top: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
`;

export const CustomTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  td {
    padding: 19px;
  }
`;

export const Quote = styled(Paragraph)`
  margin-top: 1rem;
  background-color: white;
  border-radius: 1rem;
  padding: 0.5rem 2rem 1rem 2rem;
`;

export const QuoteAuthor = styled.div`
  display: flex;
  justify-content: ${(props) => props.alignment};
`;

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
