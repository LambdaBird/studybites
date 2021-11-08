import { Badge, Button, Col, Row, Typography } from 'antd';
import styled from 'styled-components';

import { SaveOutlined } from '@sb-ui/components/Icons';
import { HEADER_HEIGHT } from '@sb-ui/components/molecules/Header/Header.styled';
import variables from '@sb-ui/theme/variables';

export const Page = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
  margin-top: ${HEADER_HEIGHT}px;
`;

export const StyledRow = styled(Row)`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 4rem;
  @media (max-width: 1200px) {
    gap: 2rem;
  }
`;

export const LeftCol = styled.div`
  min-height: 100%;
  display: flex;
  justify-content: center;
  flex-basis: 800px;
`;

export const EditorWrapper = styled.div`
  background-color: white;
  border: 32px solid #e2eff8;
  border-radius: 40px;
  min-height: 100%;
  padding: 2rem;
  width: 100%;
  position: relative;
`;

export const RightColWidth = `
  width: 350px;
  @media (max-width: 1200px) {
    width: 100%;
    max-width: 300px;
  }
`;

export const RightCol = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  ${RightColWidth};
`;

export const RightColContent = styled.div`
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  ${RightColWidth};
`;

export const InputTitle = styled.input`
  border: none;
  margin-bottom: 1rem;
  &:focus {
    outline: none;
  }
  font-size: 1.5rem;
  padding-left: 0.625rem;
  @media (max-width: 1200px) {
    padding-left: 0;
  }
  width: 100%;
`;

export const SaveButton = styled(Button).attrs({
  icon: <SaveOutlined />,
  type: 'primary',
  size: 'large',
})`
  width: 100%;
`;

export const MoveButton = styled(Button).attrs({
  size: 'medium',
})`
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

export const DisabledLink = styled(Typography.Link).attrs({
  disabled: true,
  underline: true,
})``;

export const DangerLink = styled(Typography.Link).attrs({
  underline: true,
  type: 'danger',
})``;

export const HeaderButtons = styled(Col)`
  margin-left: auto;
  margin-right: 2rem;
`;

export const PublishButton = styled(Button)`
  margin-left: 1rem;
`;

export const RowS = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2.375rem;
  margin-bottom: 2rem;
`;

export const UndoRedoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
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
