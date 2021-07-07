import { Typography } from 'antd';
import styled from 'styled-components';

const { Paragraph } = Typography;

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
