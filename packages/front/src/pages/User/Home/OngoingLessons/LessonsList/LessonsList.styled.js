import { Col, Row } from 'antd';
import styled from 'styled-components';

export const LessonsMainRow = styled(Row)`
  height: 100%;
  width: 100%;
`;

export const LessonsMainEmpty = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

export const LessonsColumn = styled(Col).attrs({
  xl: { span: 8 },
  lg: { span: 24 },
})`
  width: 100%;
`;
