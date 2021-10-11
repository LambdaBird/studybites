import { Button, Row, Typography, Upload as UploadAntd } from 'antd';
import styled from 'styled-components';
import {
  PaperClipOutlined,
  RightOutlined as RightOutlinedAntd,
} from '@ant-design/icons';

import variables from '@sb-ui/theme/variables';

const { Text } = Typography;

export const BlockWrapperWhite = styled(Row)`
  width: 100%;
  background-color: white;
  box-shadow: 0px -4px 10px rgba(231, 231, 231, 0.5);
  border-radius: 8px;
  max-width: 614px;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  overflow-y: hidden;
  @media (max-width: 767px) {
    max-width: none;
    overflow-x: hidden;
    width: 100vw;
  }
`;

export const Upload = styled(UploadAntd).attrs({
  name: 'file',
  itemRender: () => null,
  action: `${process.env.REACT_APP_SB_HOST}/api/v1/files`,
})`
  order: ${(props) => (props.$allowSend ? 'none' : '3')};
`;

export const AttachFile = styled(PaperClipOutlined)`
  color: ${variables['primary-color']};
  cursor: pointer;
  font-size: 2rem;

  margin-right: ${(props) => (props.$allowSend ? '0.5rem' : '0')};
`;

export const Question = styled(Text)`
  font-style: italic;
`;

export const Textarea = styled.textarea.attrs({
  rows: 2,
})`
  flex: 1;
  outline: none;
  border: none;
  word-break: break-word;
  resize: none;
  transform: translateY(25%);
`;

export const SendButton = styled(Button).attrs({
  type: 'secondary',
  shape: 'circle',
  size: 'medium',
})`
  flex: 0;
  border: 0;
  ${(props) => (!props.$allowSend ? 'display: none;' : '')}
  background-color: ${variables['button-send-background']};
`;

export const RightOutlined = styled(RightOutlinedAntd)`
  color: ${variables['button-send-color']};
`;

export const UploadedFileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UploadedFileName = styled.span`
  margin-left: 0.5rem;
`;

export const FileWrapper = styled.div`
  width: 100%;
  @media (max-width: 767px) {
    max-width: none;
    overflow-x: hidden;
    overflow-y: hidden;
    width: 100vw;
    margin-top: auto;
  }
  margin-bottom: -2rem;
  z-index: 2;
`;
