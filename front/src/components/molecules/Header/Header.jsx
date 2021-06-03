import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { ProfileText, RowMain, SignOutButton } from './Header.styled';
import logoImg from '../../../resources/img/logo.svg';
import profileImg from '../../../resources/img/profile.svg';
import { clearJWT, getJWTAccessToken } from '../../../utils/jwt';

const Header = () => {
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

  return (
    <header>
      <RowMain align="middle" justify="space-between">
        <Col>
          <Row align="middle">
            <img src={logoImg} alt="Logo" />
          </Row>
        </Col>
        {isAuth && (
          <Col>
            <Row align="middle">
              <SignOutButton type="danger" onClick={onClickSignOut}>
                Sign out
              </SignOutButton>
              <ProfileText>Profile</ProfileText>
              <img height={32} width={32} src={profileImg} alt="Profile" />
            </Row>
          </Col>
        )}
      </RowMain>
    </header>
  );
};

export default Header;
