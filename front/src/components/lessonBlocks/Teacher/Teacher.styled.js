import { Badge, Button, Col, Image, Row, Typography } from 'antd';
import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

const { Text, Title } = Typography;

export const Wrapper = styled(Row)`
  height: 100%;
  box-shadow: 0 2px 8px 0 #00000026;
  background: rgba(255, 255, 255, 1);
`;

export const CardDescription = styled(Col)`
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem 0.5rem 1rem;
`;

export const CardImage = styled(Image).attrs({
  height: '100%',
  width: '100%',
  preview: false,
})`
  object-fit: cover;
`;

export const ImageCol = styled(Col)`
  height: 100%;
  padding: 0.5rem;
`;

export const BadgeWrapper = styled.div`
  right: 1rem;
  top: 1rem;
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`;

export const TitleEllipsis = styled(Title)`
  overflow-wrap: anywhere;
`;

export const CardText = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
`;

export const CardButton = styled(Button)`
  justify-self: flex-end;
  align-self: flex-end;
  margin: 0 0.5rem 0 0;
`;

export const CardBadge = styled(Badge)`
  min-width: 50px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  text-align: center;
`;

export const StatusText = styled(Text)`
  font-size: 0.75rem;
  color: ${variables['secondary-text-color']};
`;

export const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > .anticon {
    display: flex;
    justify-content: flex-end;
    font-size: 1.25rem;
    cursor: pointer;
  }
`;
