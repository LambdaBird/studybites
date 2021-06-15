import { Col, Dropdown, Menu } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { HOME, LESSON_EDIT, SIGN_IN } from '@sb-ui/utils/paths';
import logo from '@sb-ui/resources/img/logo.svg';
import { clearJWT } from '@sb-ui/utils/jwt';
import {
  Container,
  Logo,
  Profile,
  RowMain,
  StyledAvatar,
} from './Header.styled';

const SKIP_HEADER = [LESSON_EDIT];

// eslint-disable-next-line no-unused-vars,react/prop-types
const Header = ({ children }) => {
  const history = useHistory();
  const location = useLocation();

  const handleSignOut = () => {
    clearJWT();
    history.push(SIGN_IN);
  };

  const handleHome = () => {
    history.push(HOME);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'signOut') {
      handleSignOut();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="signOut">Sign out</Menu.Item>
    </Menu>
  );

  if (SKIP_HEADER.includes(location.pathname) && !children) {
    return null;
  }

  return (
    <Container>
      <RowMain align="middle" justify="space-between">
        <Col>
          <Logo onClick={handleHome} src={logo} alt="Logo" />
        </Col>
        {children}
        <Col>
          <Dropdown overlay={menu} trigger={['click']}>
            <Profile data-testid="profile">
              <StyledAvatar>T</StyledAvatar>
              <DownOutlined />
            </Profile>
          </Dropdown>
        </Col>
      </RowMain>
    </Container>
  );
};

export default Header;
