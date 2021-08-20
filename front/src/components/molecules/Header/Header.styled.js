import { Avatar, Menu as MenuAntd, Row, Typography } from 'antd';
import styled from 'styled-components';
import { MenuOutlined as MenuOutlinedAntd } from '@ant-design/icons';

const { Text } = Typography;

export const HEADER_HEIGHT = 56;

export const Container = styled.header`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: white;
  height: ${HEADER_HEIGHT}px;
  z-index: 4;
  ${(props) =>
    props.hideOnScroll &&
    `
    width: 100%;
    position: fixed;
    top: 0;
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

export const RowMain = styled(Row).attrs({
  align: 'middle',
  justify: 'space-between',
})`
  padding: 0 2rem;
  @media (max-width: 767px) {
    padding: 0 1rem;
  }
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

export const DropdownBackground = styled.div`
  position: fixed;
  min-height: 100%;
  width: 100%;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const MenuOutlined = styled(MenuOutlinedAntd)`
  font-size: 20px;
`;

export const Menu = styled(MenuAntd)`
  z-index: 3;
`;

export const MenuWrapper = styled.div`
  position: absolute;
  z-index: 3;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  transform: ${(props) =>
    props.visible ? `translateY(${HEADER_HEIGHT}px)` : 'translateY(-100%)'};
`;

export const LogoLink = styled.div`
  cursor: pointer;
`;
