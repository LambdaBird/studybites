import { Col, Progress as AntdProgress, Row as AntdRow } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

import MainHeader from '@sb-ui/components/molecules/Header';
import variables from '@sb-ui/theme/variables';

export const Header = styled(MainHeader).attrs({
  style: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
})``;

export const Progress = styled(AntdProgress).attrs({
  trailColor: variables['progress-trail-color'],
  strokeWidth: 2,
  showInfo: false,
  strokeLinecap: 'round',
})`
  position: fixed;
  top: 43px;
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
`;

export const BlockCell = styled(Col).attrs(() => ({
  xs: { span: 20 },
  sm: { span: 18 },
  md: { span: 16 },
  lg: { span: 14 },
}))`
  display: flex;
  justify-content: center;
`;

export const Row = styled(AntdRow)`
  margin-top: 4rem;
  justify-content: center;
`;

export const ChunkWrapper = styled.div`
  width: 100%;
  background-color: ${variables['learn-chunk-background']};
  border-radius: 8px;
  padding: 2rem;
  max-width: 614px;

  p:last-child {
    margin-bottom: 0;
  }
`;
