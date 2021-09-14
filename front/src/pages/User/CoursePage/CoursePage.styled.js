import { Empty, Row, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const Page = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

export const StyledRow = styled(Row).attrs({
  align: 'top',
})`
  height: 100%;
  width: 100%;
  display: flex;
`;

export const LessonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 40px;
  min-height: 100%;
  padding-top: 1rem;
  max-width: 850px;
  margin: 0 auto;
`;

export const CardWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const BlockWrapper = styled(Row)`
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
`;

export const InfoRow = styled(Row)`
  width: 100%;
`;

export const TitleEllipsis = styled(Title)`
  overflow-wrap: anywhere;
`;

export const EmptyContainer = styled(Empty)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
