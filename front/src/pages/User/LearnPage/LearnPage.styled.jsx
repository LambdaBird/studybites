import { Button, Col, Progress as AntdProgress, Row as AntdRow } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

import { HEADER_HEIGHT } from '@sb-ui/components/molecules/Header/Header.styled';
import variables from '@sb-ui/theme/variables';

export const Progress = styled(AntdProgress).attrs({
  trailColor: variables['progress-trail-color'],
  strokeWidth: 2,
  showInfo: false,
  strokeLinecap: 'round',
})`
  position: absolute;
  bottom: -10px;
  z-index: 2;
`;

export const GlobalStylesLearnPage = createGlobalStyle`
  body{
    background-color: white; 
  }
`;

export const LearnWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin: 0 auto;
  max-width: 614px;
`;

export const Wrapper = styled.div`
  height: 100%;
  margin-top: ${HEADER_HEIGHT}px;
`;

export const BlockCell = styled(Col).attrs(() => ({
  xs: { span: 20 },
  sm: { span: 18 },
  md: { span: 16 },
  lg: { span: 14 },
}))`
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

export const Row = styled(AntdRow)`
  height: 100%;
  padding-top: 2rem;
  justify-content: center;
`;

export const ChunkWrapper = styled.div`
  width: 100%;
  background-color: ${variables['learn-chunk-background']};
  border-radius: 8px;
  padding: 1rem;

  @media (max-width: 767px) {
    margin-top: ${(props) => (props.isBottom ? 'auto' : '')};
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

export const LessonButton = styled(Button).attrs({
  size: 'large',
})`
  @media (max-width: 767px) {
    margin-top: auto;
  }
  width: 100%;
  margin-bottom: 1rem;
`;
