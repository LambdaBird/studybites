import { Col, Progress as AntdProgress, Row as AntdRow } from 'antd';
import styled from 'styled-components';

export const Progress = styled(AntdProgress)`
  top: -10px;
  position: relative;
`;

export const LearnPageWrapper = styled.div`
  background-color: #fff;
`;

export const LearnWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: none;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin: 0 auto;
  height: 100vh;
  background-color: #fff;
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
  justify-content: center;
`;

export const ChunkWrapper = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  max-width: 614px;
`;

