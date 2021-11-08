import { Button, Col as AntdCol } from 'antd';
import styled from 'styled-components';

import { UploadOutlined } from '@sb-ui/components/Icons';

export const Image = styled.img`
  object-fit: cover;
  height: 15rem;
  width: 100%;
`;

export const ImageFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15rem;
  width: 100%;
  font-size: xx-large;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const ImageFallbackTitle = styled.span`
  margin-right: 1rem;
`;

export const UploadButton = styled(Button).attrs({
  icon: <UploadOutlined />,
})`
  width: 100%;
`;

export const Col = styled(AntdCol).attrs({
  span: 24,
})``;
