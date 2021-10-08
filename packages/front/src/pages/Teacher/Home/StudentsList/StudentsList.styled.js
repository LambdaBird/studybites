import { Avatar, Empty, Row, Typography } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

const { Title, Text } = Typography;

export const Wrapper = styled(Row)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem 1.5rem 1rem 1.5rem;
  box-shadow: 0 4px 4px 0 rgba(240, 241, 242, 1);
  background: rgba(255, 255, 255, 1);
  width: 400px;
`;

export const ListTitle = styled(Title).attrs({
  level: 4,
})`
  padding-top: 0.5rem;
`;

export const EmptyList = styled(Empty).attrs({
  imageStyle: {
    height: 60,
  },
})`
  padding-top: 4rem;
`;

export const EmptyListHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const ListHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AuthorAvatar = styled(Avatar)`
  color: ${variables['avatar-second-color']};
  background-color: ${variables['avatar-first-color']};
`;

export const AuthorName = styled(Text)`
  white-space: nowrap;
`;

export const StudentsRow = styled(Row).attrs({
  gutter: [16, 16],
  align: 'top',
})`
  width: 100%;
`;
