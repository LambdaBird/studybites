import React, { useState } from 'react';
import { Col, Row, Menu, Dropdown } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { isBrowser, isMobile } from 'react-device-detect';
import { LogoText, ProfileText, RowMain, SignOutButton, MenuIcon } from './Header.styled';
import logoImg from '../../../resources/img/logo.svg';
import profileImg from '../../../resources/img/profile.svg';
import { clearJWT, getJWTAccessToken } from '../../../utils/jwt';
import menuImg from '../../../resources/img/menu.svg';

const Header = () => {
  const logoTitle = 'StudyBites';
  const history = useHistory();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);

  React.useEffect(() => {
    setIsAuth(!!getJWTAccessToken());
  }, [location.pathname]);

  const onClickSignOut = () => {
    clearJWT();
    history.push('/signIn');
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <SignOutButton type="danger" onClick={onClickSignOut}>
          Sign out
        </SignOutButton>
      </Menu.Item>
    </Menu>
  );

  return (
    <header>
      <RowMain align="middle" justify="space-between">
        <Col>
          <Row align="middle">
            <img src={logoImg} alt="Logo" />
            <LogoText strong level={5}>
              {logoTitle}
            </LogoText>
          </Row>
        </Col>
        {isAuth && (
          <Col>
            <Row align="middle">
              {isBrowser
                ? <SignOutButton type="danger" onClick={onClickSignOut}>
                    Sign out
                  </SignOutButton>
                : null
              }
              <ProfileText>Profile</ProfileText>
              <img height={32} width={32} src={profileImg} alt="Profile" />
              {isMobile
                ? <Dropdown overlay={menu} trigger={['click']}>
                    <MenuIcon
                      height={32}
                      width={32}
                      src={menuImg}
                      alt="Menu"
                    />
                  </Dropdown> 
                : null
              }
            </Row>
          </Col>
        )}
      </RowMain>
    </header>
  );
};

export default Header;
