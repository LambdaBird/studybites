import styled from 'styled-components';
import { Avatar, Empty, Row, Typography } from 'antd';
import { VOLCANO_2, VOLCANO_6 } from '@sb-ui/resources/styles/Global.styled';

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

export const ListTitle = styled(Title)`
  padding-top: 0.5rem;
`;

export const EmptyList = styled(Empty)`
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
  color: ${VOLCANO_6};
  background-color: ${VOLCANO_2};
`;

export const AuthorName = styled(Text)`
  white-space: nowrap;
`;

export const StudentsRow = styled(Row)`
  width: 100%;
`;
