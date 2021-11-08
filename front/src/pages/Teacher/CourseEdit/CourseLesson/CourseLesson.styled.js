import { Badge, Button, Col, Row, Typography } from 'antd';
import styled from 'styled-components';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
} from '@sb-ui/components/Icons';
import variables from '@sb-ui/theme/variables';

const { Text, Title } = Typography;

export const Wrapper = styled(Row).attrs({
  justify: 'center',
  align: 'middle',
})`
  opacity: ${(props) => props.opacity};
  flex: 1 1 auto;
  height: 10rem;
  box-shadow: 0 2px 8px 0 #00000026;
  background: rgba(255, 255, 255, 1);
  margin-right: 3rem;
`;

export const ArrowWrapper = styled.div`
  position: absolute;
  height: 10rem;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ArrowUp = styled(ArrowUpOutlined)`
  font-size: xx-large;
  cursor: pointer;
`;

export const Close = styled(CloseOutlined)`
  font-size: xx-large;
  color: red;
`;

export const ArrowDown = styled(ArrowDownOutlined)`
  font-size: xx-large;
  cursor: pointer;
`;

export const CardDescription = styled(Col)`
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem 0.5rem 1rem;
`;

export const CardImage = styled.img`
  height: 100%;
  width: 100%;
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

export const TitleEllipsis = styled(Title).attrs({
  ellipsis: {
    tooltip: true,
  },
  level: 4,
})``;

export const CardText = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  width: 100%;
`;

export const CardButton = styled(Button)`
  justify-self: flex-end;
  align-self: flex-end;
  margin: 0 0.5rem 0 0;
`;

export const CardBottom = styled(Row)`
  margin-top: auto;
  justify-content: space-between;
  width: 100%;
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
  justify-content: flex-end;

  & > .anticon {
    display: flex;
    justify-content: flex-end;
    font-size: 1.25rem;
    cursor: pointer;
  }
`;
