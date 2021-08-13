import { Button } from 'antd';
import FlipMove from 'react-flip-move';
import styled from 'styled-components';

import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import ArrowConnect from '@sb-ui/resources/img/arrowConnect.svg';

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

export const MatchBlockWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  height: ${(props) => `${props.height + 16}px`};
`;

export const MatchBlock = styled.div`
  width: 100%;
  padding: 1rem;
  background: ${(props) => (props.selected ? '#E6F7FF' : '#FAFAFA')};
  transform: ${(props) => (props.selected ? 'scale(0.95)' : 'scale(1)')};
  transition: all 100ms ease-in;
  transition-property: background, transform;
  box-shadow: 0 2px 8px rgba(172, 172, 172, 0.15);
  border-radius: 16px;
  cursor: pointer;
`;

export const MatchWrapper = styled(ChunkWrapper)`
  display: flex;
  justify-content: space-between;
`;

export const MatchMiddle = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  width: 20%;
`;

export const MatchColumn = styled(FlipMove)`
  align-items: center;
  width: 30%;
  @media (max-width: 767px) {
    width: 40%;
  }
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const MatchLine = styled.div`
  align-items: center;
  width: 100%;
  @media (max-width: 767px) {
    width: 100%;
  }
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const ArrowConnectWrapper = styled.div`
  display: flex;
  padding-top: 2rem;
  align-items: flex-start;
  height: ${(props) => `${props.height + 16}px`};
`;

export const ArrowConnectImg = styled.img.attrs({
  src: ArrowConnect,
})`
  width: 100%;
`;
