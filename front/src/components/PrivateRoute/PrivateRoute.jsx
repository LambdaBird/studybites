import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { getJWT } from '../../utils/jwt/jwt';

const PrivateRoute = ({ children: Component, ...rest }) => {
  const isLoggedIn = !!getJWT()?.accessToken;
  if (isLoggedIn) {
    return <Route {...rest}>{Component}</Route>;
  }
  return <Redirect to={{ pathname: '/signIn' }} />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
