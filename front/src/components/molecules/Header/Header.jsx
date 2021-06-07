import { Col, Dropdown, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { HOME, SIGN_IN } from '@sb-ui/utils/paths';
import logo from '@sb-ui/resources/img/logo.svg';
import { clearJWT } from '@sb-ui/utils/jwt';
import {
  Container,
  Logo,
  Profile,
  RowMain,
  StyledAvatar,
} from './Header.styled';

const Header = () => {
  const history = useHistory();

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

  return (
    <Container>
      <RowMain align="middle" justify="space-between">
        <Col>
          <Logo onClick={handleHome} src={logo} alt="Logo" />
        </Col>

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
