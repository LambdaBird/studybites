import { Badge, Button, Col, Input, Row, Typography } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const Page = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
`;

export const StyledRow = styled(Row)`
  height: 100%;
  width: 100%;
  display: flex;
`;

export const LeftCol = styled(Col)`
  height: 100%;
  @media (min-width: 1450px) {
    margin: 0 auto;
  }
`;

export const EditorWrapper = styled.div`
  background-color: white;
  border: 32px solid #e2eff8;
  border-radius: 40px;
  min-height: 100%;
  padding: 2rem;
  max-width: 850px;
  position: relative;
`;

export const RightCol = styled(Col)`
  height: 100%;
  width: 100%;
  position: fixed;
  right: 0;
  padding: 2rem;
  @media (min-width: 1600px) {
    right: 8rem;
  }
`;

export const InputTitle = styled.input`
  border: none;
  margin-bottom: 1rem;
  &:focus {
    outline: none;
  }
  font-size: 1.5rem;
  width: 100%;

  @media (min-width: 1200px) {
    padding: 0 2.25rem;
  }
`;

export const SaveButton = styled(Button)`
  width: 100%;
`;

export const MoveButton = styled(Button)`
  width: 100%;
`;

export const StudentsCount = styled(Badge)`
  margin-left: 0.5rem;
  & sup {
    color: #999;
    background-color: #fff;
    box-shadow: 0 0 0 1px #d9d9d9 inset;
  }
`;

export const TextLink = styled(Typography.Link)`
  color: ${variables['text-color']}!important;
`;

export const HeaderButtons = styled(Col)`
  margin-left: auto;
  margin-right: 2rem;
`;

export const PublishButton = styled(Button)`
  margin-left: 1rem;
`;

export const RowStyled = styled(Row)`
  margin-bottom: 2rem;
`;

export const StudentsCol = styled(Col)`
  display: flex;
  align-items: center;
`;

export const BadgeWrapper = styled.div`
  right: 1rem;
  top: 1rem;
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`;

export const CardBadge = styled(Badge)`
  min-width: 50px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  text-align: center;
  border: 1px solid #d9d9d9;
`;

export const StatusText = styled(Typography.Text)`
  font-size: 1rem;
  color: ${variables['secondary-text-color']};
`;

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

export const JoinText = styled.div`
  margin-bottom: 0.5rem;
`;

export const CopyLinkInput = styled(Input)`
  input {
    margin-left: 1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .ant-input-group-addon {
    padding: 0;
    border: none;
  }
  .ant-input-group-addon > button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export const CopyButton = styled(Button)`
  height: 100%;
`;
