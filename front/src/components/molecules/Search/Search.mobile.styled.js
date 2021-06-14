import styled from 'styled-components';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

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
