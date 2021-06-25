import styled from 'styled-components';
import { Checkbox, Col, Row } from 'antd';

export const BlockWrapper = styled(Row)`
  width: 100%;
  max-width: 614px;
  padding: 2rem;
  background-color: rgba(245, 245, 245, 1);
  border-radius: 8px;
`;

export const BlockWrapperWhite = styled(Row)`
  width: 100%;

  padding: 2rem;
  background-color: white;
  box-shadow: 0px -4px 10px rgba(231, 231, 231, 0.5);
  border-radius: 8px;
  max-width: 614px;
  @media (max-width: 767px) {
    max-width: none;
  }
`;

export const PageRow = styled(Row)`
  width: 100%;
`;

export const StyledRow = styled(Row)`
  width: 100%;
`;

export const BlockCol = styled(Col)`
  display: flex;
  justify-content: center;
  padding-top: 3rem;
`;

export const ColumnCheckbox = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
`;
