import { Tag as TagAntd, Typography } from 'antd';
import styled from 'styled-components';

const { Paragraph } = Typography;

export const TagWrapper = styled(Paragraph).attrs({
  ellipsis: {
    tooltip: true,
    rows: 1,
  },
})`
  width: 100%;
  margin-bottom: -0.25rem !important;
`;

export const Tag = styled(TagAntd)`
  margin-bottom: 0.25rem;
`;
