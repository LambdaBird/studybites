import styled from 'styled-components';
import { Badge, Button, Col, Row, Typography } from 'antd';
import variables from '@sb-ui/theme/variables';

export const Page = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
  margin: 0 auto;
`;

export const StyledRow = styled(Row)`
  height: 100%;
  width: 100%;
  display: flex;
`;

export const LeftCol = styled(Col)`
  height: 120%;
  width: 650px;
  margin-left: 12rem;
  padding: 2rem;
  background-color: white;
  border: 32px solid #e2eff8;
  border-radius: 40px;
`;

export const RightCol = styled(Col)`
  height: 100%;
  position: fixed;
  right: 12rem;
  padding: 2rem;
  margin-left: 2rem;
`;

export const InputTitle = styled.input`
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: none;
  transition: border-bottom-style 2s;
  margin-bottom: 1rem;
  &:focus {
    outline: none;
    border-bottom-style: groove;
  }
  font-size: 24px;
  width: 100%;
  text-align: center;
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
  margin-left: 2rem;
`;

export const RowStyled = styled(Row)`
  margin-bottom: 2rem;
`;
