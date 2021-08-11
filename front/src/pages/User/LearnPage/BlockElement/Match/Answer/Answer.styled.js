import { Button } from 'antd';
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

export const MatchBlock = styled.div`
  width: 35%;
  @media (max-width: 767px) {
    width: 40%;
  }
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
