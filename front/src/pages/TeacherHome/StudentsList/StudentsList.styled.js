import styled from 'styled-components';
import { Row, Typography, Empty } from 'antd';

const { Title } = Typography;

export const Wrapper = styled(Row)`
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 24px 16px 24px;
  box-shadow: 0px 4px 4px 0px rgba(240, 241, 242, 1);
  background: rgba(255, 255, 255, 1);
`;

export const ListTitle = styled(Title)`
  padding-top: 0.5rem;
`;

export const EmptyList = styled(Empty)`
  padding-top: 64px;
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
