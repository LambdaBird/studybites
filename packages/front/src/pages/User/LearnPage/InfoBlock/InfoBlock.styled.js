import { Row, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const BlockWrapper = styled(Row)`
  width: 100%;
  padding: 2rem;
  background-color: rgba(245, 245, 245, 1);
  border-radius: 8px;
`;

export const StyledRow = styled(Row)`
  width: 100%;
`;

export const TitleEllipsis = styled(Title).attrs({
  level: 2,
  ellipsis: {
    tooltip: true,
    rows: 3,
  },
})``;
