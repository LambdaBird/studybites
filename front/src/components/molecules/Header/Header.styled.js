import { Avatar, Row, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

export const HEADER_HEIGHT = 56;

export const Container = styled.header`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: white;
  height: ${HEADER_HEIGHT}px;
  z-index: 100;
  ${(props) =>
    props.hideOnScroll &&
    `
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 2;
    & + *{
      margin-top: ${HEADER_HEIGHT}px;
    }
  `}
  ${(props) =>
    props.scroll === 'down' &&
    `transform:translateY(-100%); transition: all 0.3s ease-in-out;
    `}
  ${(props) =>
    props.scroll === 'up' &&
    `
    transform:translateY(0); transition: all 0.3s ease-in-out;
  `};
`;

export const RowMain = styled(Row)`
  padding: 0 2rem;
  height: ${HEADER_HEIGHT}px;
`;

export const Logo = styled.img`
  height: 1.75rem;
  cursor: pointer;
`;

export const StyledAvatar = styled(Avatar)`
  color: #f56a00;
  background-color: #fde3cf;
`;

export const Profile = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledName = styled(Text)`
  font-size: 0.85rem;
`;
