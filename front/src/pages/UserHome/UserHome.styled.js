import styled from 'styled-components';
import { Row, Typography, Col, Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  padding: 3rem;
  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

export const OpenHeader = styled(Row)`
  margin-bottom: 1rem;
  @media (max-width: 767px) {
    padding: 1rem 2rem;
    width: 100%;
  }
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 767px) {
    justify-content: space-between;
  }
`;

export const OpenTitle = styled(Typography.Title)`
  margin-bottom: 0 !important;
  @media (max-width: 767px) {
    size: 24px !important;
    line-height: 32px !important;
    font-weight: 400 !important;
  }
`;

export const Column = styled(Col)`
  width: 100%;
`;

export const ButtonFilter = styled(Button)`
  margin-right: 8px;
`;

export const ButtonClose = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  background: none;
  border: none;
  color: #fff;
`;

export const CloseIcon = styled(CloseOutlined)`
  font-size: 25px;
`;

export const SearchModal = styled(Modal)`
  padding: 3rem;
`;
