import { Button } from 'antd';
import styled from 'styled-components';

import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

export const LessonButtonSend = styled(Button).attrs({
  size: 'large',
})`
  width: 100%;
  margin-bottom: 1rem;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
  @media (max-width: 767px) {
    margin-top: auto;
  }
  display: flex;
  justify-content: flex-end;
`;

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

export const MatchWrapper = styled(ChunkWrapper)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0;
`;
