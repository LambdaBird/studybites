import styled from 'styled-components';

import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import ArrowConnect from '@sb-ui/resources/img/arrowConnect.svg';

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

export const MatchWrapper = styled(ChunkWrapper)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const MatchLine = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const ArrowConnectImg = styled.img.attrs({
  src: ArrowConnect,
})`
  width: 20%;
  @media (max-width: 767px) {
    width: 10%;
  }
`;
