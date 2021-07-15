import { Redirect, Route } from 'react-router-dom';
import styled from 'styled-components';

import logo from '@sb-ui/resources/img/logo.svg';
import { HOME } from '@sb-ui/utils/paths';
import { ChildrenType } from '@sb-ui/utils/types';

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
  children: ChildrenType.isRequired,
};

export default AuthRoute;

const Logo = styled.div`
  padding: 1rem;
`;
