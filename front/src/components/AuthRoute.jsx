import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getJWTAccessToken } from '../utils/jwt';

const AuthRoute = ({ children: Component, ...rest }) => {
  const isLoggedIn = getJWTAccessToken();
  if (!isLoggedIn) {
    return <Route {...rest}>{Component}</Route>;
  }
  return <Redirect to={{ pathname: '/' }} />;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRoute;
