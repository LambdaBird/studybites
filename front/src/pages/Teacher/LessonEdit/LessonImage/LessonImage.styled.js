import { Button } from 'antd';
import styled from 'styled-components';

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

export const UploadButton = styled(Button)`
  width: 100%;
`;
