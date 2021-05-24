import React from 'react';
import { Col, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import { getJWT } from '../../../utils/jwt/jwt';
import profileImg from '../../../resources/img/profile.svg';

const { Title, Text } = Typography;

const Header = ({ logoImg, logoTitle }) => {
  const isAuth = !!getJWT()?.accessToken;

  return (
    <header>
      <Row
        align="middle"
        justify="space-between"
        style={{
          paddingLeft: '40px',
          paddingRight: '40px',
          height: '3.5rem',
        }}
      >
        <Col>
          <Row align="middle">
            <img style={{ display: 'block' }} src={logoImg} alt="Logo" />{' '}
            <Title style={{ marginLeft: '0.5rem', marginBottom: 0 }} level={5}>
              {logoTitle}
            </Title>
          </Row>
        </Col>
        {isAuth && (
          <Col>
            <Row align="middle">
              <Text style={{ marginRight: '0.5rem' }}>Admin</Text>
              <img height={32} width={32} src={profileImg} alt="Profile" />
            </Row>
          </Col>
        )}
      </Row>
    </header>
  );
};

Header.propTypes = {
  logoImg: PropTypes.string.isRequired,
  logoTitle: PropTypes.string.isRequired,
};

export default Header;
