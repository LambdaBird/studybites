import styled from 'styled-components';

import { MatchBlock as MatchBlockAnswer } from '../Answer/Answer.styled';

export const AnswerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AnswerWrapperWrong = styled(AnswerWrapper)`
  flex-direction: column;
`;

export const AnswerWrapperWrongTitle = styled(AnswerWrapperWrong)`
  flex-direction: row;
  width: 100%;
`;

export const MatchBlock = styled(MatchBlockAnswer)`
  background-color: ${(props) => (props.correct ? '#F6FFED' : '#D9D9D9')};
  user-select: none;
  cursor: default;
`;

export const MatchBlockResult = styled(MatchBlockAnswer)`
  user-select: none;
  cursor: default;
`;
