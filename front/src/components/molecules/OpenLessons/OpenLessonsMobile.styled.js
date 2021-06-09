import styled from 'styled-components';
import { Row, Typography, Col, Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const Header = styled(Row)`
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  width: 100%;
`;

export const HeaderTitle = styled(Title)`
  size: 24px !important;
  line-height: 32px !important;
  font-weight: 400 !important;
  margin-bottom: 0 !important;
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
