import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import styled from 'styled-components';

import logo from '@sb-ui/resources/img/logo.svg';
import { HOME } from '@sb-ui/utils/paths';

import { getJWTAccessToken } from '../utils/jwt';

const AuthRoute = ({ children: Component, ...rest }) => {
  const isLoggedIn = getJWTAccessToken();
  if (!isLoggedIn) {
    return (
      <>
        <Logo>
          <img src={logo} alt="logo" />
        </Logo>
        <Route {...rest}>{Component}</Route>
      </>
    );
  }
  return <Redirect to={{ pathname: HOME }} />;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRoute;

const Logo = styled.div`
  padding: 1rem;
`;
