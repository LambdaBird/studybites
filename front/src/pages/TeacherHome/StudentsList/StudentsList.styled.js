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
  align-self: flex-start;
`;

export const EmptyList = styled(Empty)`
  padding-top: 64px;
`;